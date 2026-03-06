/**
 * Generate A/L-style multiple choice questions using OpenAI.
 *
 * IMPORTANT: Calling OpenAI directly from the browser exposes your API key.
 * For real deployments, proxy this through your backend.
 *
 * If no OpenAI key is configured, this function falls back to a free/no-key
 * question bank (Open Trivia DB). That fallback is not guaranteed to match the
 * exact A/L syllabus or the provided topic, but it returns valid MCQs.
 *
 * @typedef {Object} ALQuizQuestion
 * @property {string} question
 * @property {[string,string,string,string]} options
 * @property {number} correctIndex  // 0..3
 * @property {string} correctAnswer // must equal options[correctIndex]
 * @property {string} explanation
 */

/**
 * @param {string} subject
 * @param {string} topic
 * @param {"Easy"|"Medium"|"Hard"|string} difficulty
 * @param {number} numQuestions
 * @param {Object} [opts]
 * @param {string} [opts.apiKey] OpenAI API key. Defaults to import.meta.env.VITE_OPENAI_API_KEY
 * @param {string} [opts.model] Model name. Defaults to "gpt-4o-mini".
 * @param {AbortSignal} [opts.signal] Optional abort signal.
 * @returns {Promise<ALQuizQuestion[]>}
 */
export async function generateALQuiz(subject, topic, difficulty, numQuestions, opts = {}) {
  if (!subject || !topic) {
    throw new Error("subject and topic are required");
  }

  const count = Number(numQuestions);
  if (!Number.isFinite(count) || count <= 0) {
    throw new Error("numQuestions must be a positive number");
  }

  const apiKey = opts.apiKey || import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    return generateFromOpenTDB(subject, difficulty, count, topic);
  }

  const model = opts.model || "gpt-4o-mini";

  const system =
    "You are an expert Sri Lankan GCE A/L question setter. Produce accurate, unambiguous MCQs.";

  const user =
    `Generate ${count} multiple-choice questions for Sri Lankan GCE A/L level.\n` +
    `Subject: ${subject}\n` +
    `Topic: ${topic}\n` +
    `Difficulty: ${difficulty}\n\n` +
    "Rules:\n" +
    "- Output MUST be valid JSON only (no markdown, no extra text).\n" +
    "- Return an array of objects.\n" +
    "- Each object fields: question (string), options (array of 4 strings), correctIndex (0-3), explanation (string).\n" +
    "- Options must be plausible and mutually exclusive.\n" +
    "- correctIndex must match the correct option.\n" +
    "- Avoid trick questions; keep wording clear.\n";

  let res;
  try {
    res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: opts.signal,
      body: JSON.stringify({
        model,
        temperature: 0.6,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
  } catch (e) {
    // Network/CORS/etc. -> fallback to free provider.
    return generateFromOpenTDB(subject, difficulty, count, topic);
  }

  if (!res.ok) {
    // If quota/rate-limited, fallback to free provider.
    if (res.status === 429) {
      return generateFromOpenTDB(subject, difficulty, count, topic);
    }

    const text = await res.text().catch(() => "");
    // Sometimes OpenAI returns JSON error bodies; detect insufficient quota.
    try {
      const parsedErr = JSON.parse(text);
      const code = parsedErr?.error?.code;
      if (code === "insufficient_quota") {
        return generateFromOpenTDB(subject, difficulty, count, topic);
      }
    } catch {
      // ignore
    }
    throw new Error(`OpenAI API error (${res.status}): ${text || res.statusText}`);
  }

  /** @type {{choices?: Array<{message?: {content?: string}}>} } */
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("OpenAI returned no content");
  }

  // Some models may still wrap JSON; attempt strict parse first, then fallback extract.
  const parsed = safeParseJsonArray(content);

  const normalized = parsed.map((q, idx) => normalizeQuestion(q, idx));
  return normalized;
}

async function generateFromOpenTDB(subject, difficulty, count, topic) {
  const category = mapSubjectToOpenTdbCategory(subject);
  const diff = String(difficulty || "").toLowerCase();

  const params = new URLSearchParams();
  params.set("amount", String(Math.min(20, Math.max(1, count))));
  params.set("type", "multiple");
  if (category) params.set("category", String(category));
  if (diff === "easy" || diff === "medium" || diff === "hard") params.set("difficulty", diff);

  const url = `https://opentdb.com/api.php?${params.toString()}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    throw new Error(`Free quiz API error (${res.status}): ${res.statusText}`);
  }

  const data = await res.json();
  const results = Array.isArray(data?.results) ? data.results : [];
  if (results.length === 0) {
    throw new Error("Free quiz API returned no questions. Try a different subject/difficulty.");
  }

  // Topic is not supported by OpenTDB; do a best-effort filter by keyword.
  const topicKeyword = String(topic || "").trim().toLowerCase();
  const filtered = topicKeyword
    ? results.filter((r) => decodeHtml(String(r?.question || "")).toLowerCase().includes(topicKeyword))
    : results;

  const picked = (filtered.length > 0 ? filtered : results).slice(0, count);

  return picked.map((r, idx) => {
    const question = decodeHtml(String(r?.question || "").trim());
    const correct = decodeHtml(String(r?.correct_answer || "").trim());
    const incorrect = Array.isArray(r?.incorrect_answers) ? r.incorrect_answers : [];
    const incorrect3 = incorrect.slice(0, 3).map((x) => decodeHtml(String(x).trim()));

    const options = shuffle([correct, ...incorrect3]);
    const correctIndex = options.findIndex((x) => x === correct);

    if (!question || options.length !== 4 || correctIndex < 0) {
      throw new Error(`Free quiz parse failed at item ${idx + 1}`);
    }

    return {
      question,
      options: /** @type {[string,string,string,string]} */ (options),
      correctIndex,
      correctAnswer: options[correctIndex],
      explanation: "Generated from a free question bank (Open Trivia DB).",
    };
  });
}

function mapSubjectToOpenTdbCategory(subject) {
  const s = String(subject || "").trim().toLowerCase();
  // OpenTDB categories: 17=Science & Nature, 18=Computers, 19=Math
  if (s.includes("ict") || s.includes("computer")) return 18;
  if (s.includes("physics") || s.includes("chem") || s.includes("bio") || s.includes("science")) return 17;
  if (s.includes("math")) return 19;
  return null;
}

function decodeHtml(str) {
  // Browser-safe decode for OpenTDB html entities
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function safeParseJsonArray(text) {
  const trimmed = text.trim();

  // Strict parse
  try {
    const v = JSON.parse(trimmed);
    if (!Array.isArray(v)) throw new Error("Expected a JSON array");
    return v;
  } catch {
    // Fallback: extract first JSON array substring
    const start = trimmed.indexOf("[");
    const end = trimmed.lastIndexOf("]");
    if (start >= 0 && end > start) {
      const slice = trimmed.slice(start, end + 1);
      const v = JSON.parse(slice);
      if (!Array.isArray(v)) throw new Error("Expected a JSON array");
      return v;
    }
    throw new Error("Failed to parse JSON from OpenAI response");
  }
}

function normalizeQuestion(raw, idx) {
  if (!raw || typeof raw !== "object") {
    throw new Error(`Question ${idx + 1}: invalid object`);
  }

  const question = String(raw.question || "").trim();
  const options = Array.isArray(raw.options) ? raw.options.map((o) => String(o).trim()) : [];
  const correctIndex = Number(raw.correctIndex);
  const explanation = String(raw.explanation || "").trim();

  if (!question) throw new Error(`Question ${idx + 1}: missing question`);
  if (options.length !== 4 || options.some((o) => !o)) {
    throw new Error(`Question ${idx + 1}: options must be 4 non-empty strings`);
  }
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) {
    throw new Error(`Question ${idx + 1}: correctIndex must be 0..3`);
  }

  return {
    question,
    options: /** @type {[string,string,string,string]} */ (options),
    correctIndex,
    correctAnswer: options[correctIndex],
    explanation: explanation || "Explanation not provided.",
  };
}
