import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import axiosClient from "../api/axiosClient";
import { generateALQuiz } from "../api/generateALQuiz";
import { jsPDF } from "jspdf";
import { resolvePublicUrl } from "../utils/resolvePublicUrl";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState(() => {
    try {
      return localStorage.getItem("dashboard.sort.all") || "none";
    } catch {
      return "none";
    }
  });
  const [enrolledSearchTerm, setEnrolledSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeMenu, setActiveMenu] = useState("all");

const [todos, setTodos] = useState([]);
const [todoText, setTodoText] = useState("");

const [reminders, setReminders] = useState([]);

  const [reminderText, setReminderText] = useState("");
  const [reminderAt, setReminderAt] = useState("");

 const [notes, setNotes] = useState([]);

  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Payment Modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("January 2026");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [payLoading, setPayLoading] = useState(false);

  const [enrollNotice, setEnrollNotice] = useState(null);

  // AI Quiz
  const [quizSubject, setQuizSubject] = useState("Biology");
  const [quizTopic, setQuizTopic] = useState("Photosynthesis");
  const [quizDifficulty, setQuizDifficulty] = useState("Medium");
  const [quizCount, setQuizCount] = useState(5);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState(null);
  const [quizItems, setQuizItems] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  // Settings
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [settingsEmail, setSettingsEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState(null);

  const navigate = useNavigate();

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setQuizError(null);
    setQuizItems([]);
    setQuizAnswers([]);
    setQuizChecked(false);
    setQuizScore(null);

    try {
      setQuizLoading(true);
      const items = await generateALQuiz(
        quizSubject.trim(),
        quizTopic.trim(),
        quizDifficulty,
        Number(quizCount)
      );
      setQuizItems(items);
      setQuizAnswers(Array(items.length).fill(null));
    } catch (err) {
      console.error("Quiz generation failed", err);
      setQuizError(err?.message || "Failed to generate quiz.");
    } finally {
      setQuizLoading(false);
    }
  };

  const selectQuizAnswer = (questionIndex, optionIndex) => {
    if (quizChecked) return;
    setQuizAnswers((prev) => {
      const next = prev.slice();
      next[questionIndex] = optionIndex;
      return next;
    });
  };

  const checkQuizResults = () => {
    if (!quizItems.length) return;
    const score = quizItems.reduce((acc, q, i) => {
      return acc + (quizAnswers[i] === q.correctIndex ? 1 : 0);
    }, 0);
    setQuizScore(score);
    setQuizChecked(true);
  };

  const safeFilename = (name) =>
    String(name || "")
      .trim()
      .replace(/[^a-z0-9-_]+/gi, "_")
      .replace(/_+/g, "_")
      .slice(0, 80);

  const downloadQuizPdf = () => {
    if (!quizItems.length) {
      setQuizError("Generate a quiz first.");
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 40;
    const lineHeight = 16;
    const maxTextWidth = pageWidth - margin * 2;

    let y = margin;

    const addLine = (text, opts = {}) => {
      const fontSize = opts.fontSize ?? 12;
      const bold = Boolean(opts.bold);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(fontSize);

      const lines = doc.splitTextToSize(String(text), maxTextWidth);
      for (const line of lines) {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      }
    };

    addLine("A/L Quiz", { bold: true, fontSize: 18 });
    addLine(`Subject: ${quizSubject}`);
    addLine(`Topic: ${quizTopic}`);
    addLine(`Difficulty: ${quizDifficulty}`);
    addLine(`Questions: ${quizItems.length}`);
    addLine(`Generated: ${new Date().toLocaleString()}`);
    if (quizChecked && quizScore != null) {
      addLine(`Score: ${quizScore}/${quizItems.length}`, { bold: true });
    }

    y += 8;

    quizItems.forEach((q, idx) => {
      addLine(`${idx + 1}. ${q.question}`, { bold: true });
      q.options.forEach((opt, oi) => {
        const letter = String.fromCharCode(65 + oi);
        const isCorrect = oi === q.correctIndex;
        const selected = quizAnswers[idx] === oi;
        const mark = isCorrect ? "[Correct]" : selected ? "[Selected]" : "";
        addLine(`   ${letter}. ${opt} ${mark}`.trim());
      });
      if (q.explanation) {
        addLine(`Explanation: ${q.explanation}`);
      }
      y += 6;
    });

    const date = new Date().toISOString().slice(0, 10);
    const filename = `${safeFilename(quizSubject)}-${safeFilename(quizTopic)}-${safeFilename(
      quizDifficulty
    )}-${date}.pdf`;
    doc.save(filename);
  };


  useEffect(() => {
    try {
      localStorage.setItem("dashboard.sort.all", sortOption);
    } catch {
      // ignore
    }
  }, [sortOption]);

  useEffect(() => {
    fetchCourses();
    fetchMyEnrollments();
     fetchTodos();
  fetchReminders();
   fetchNotes();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (activeMenu !== "settings") return;
    fetchProfile();
    // eslint-disable-next-line
  }, [activeMenu]);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setProfile(null);
      setProfileError("Please login first.");
      return;
    }

    try {
      setProfileLoading(true);
      setProfileError(null);
      const res = await axiosClient.get("/api/users/dashboard");
      setProfile(res.data);
      setSettingsEmail(res.data?.email || "");
    } catch (e) {
      console.error("Failed to load profile", e);
      setProfileError("Failed to load profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSettingsMessage(null);

    const email = settingsEmail.trim();
    const wantsPasswordChange = newPassword.trim().length > 0 || confirmPassword.trim().length > 0;

    if (wantsPasswordChange) {
      if (!currentPassword.trim()) {
        setSettingsMessage({ type: "error", text: "Current password is required." });
        return;
      }
      if (newPassword.trim().length < 6) {
        setSettingsMessage({ type: "error", text: "New password must be at least 6 characters." });
        return;
      }
      if (newPassword !== confirmPassword) {
        setSettingsMessage({ type: "error", text: "New password and confirm password do not match." });
        return;
      }
    }

    try {
      setSettingsSaving(true);
      const payload = {
        email,
        currentPassword: wantsPasswordChange ? currentPassword : "",
        newPassword: wantsPasswordChange ? newPassword : "",
      };

      const res = await axiosClient.put("/api/users/settings", payload);
      setProfile((prev) => ({ ...prev, email: res.data?.email ?? email }));
      setSettingsMessage({ type: "success", text: "Settings updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err?.response?.data || "Failed to update settings.";
      setSettingsMessage({ type: "error", text: String(msg) });
    } finally {
      setSettingsSaving(false);
    }
  };

  const fetchNotes = async () => {
  try {
    const res = await axiosClient.get("/api/notes");
    setNotes(res.data || []);
  } catch (e) {
    console.error("Failed to load notes", e);
  }
};


  const addTodo = async () => {
  const text = todoText.trim();
  if (!text) return;

  try {
    const res = await axiosClient.post("/api/todos", { text });
    setTodos((prev) => [res.data, ...prev]);
    setTodoText("");
  } catch {
    setEnrollNotice({ type: "error", text: "Failed to add todo" });
  }
};


const toggleTodo = async (todo) => {
  try {
    const res = await axiosClient.put(`/api/todos/${todo.id}`, {
      text: todo.text,
      done: !todo.done,
    });

    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? res.data : t))
    );
  } catch {
    setEnrollNotice({ type: "error", text: "Failed to update todo" });
  }
};

  const deleteTodo = async (id) => {
  try {
    await axiosClient.delete(`/api/todos/${id}`);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  } catch {
    setEnrollNotice({ type: "error", text: "Failed to delete todo" });
  }
};


  const addReminder = async () => {
  const text = reminderText.trim();
  if (!text || !reminderAt) return;

  try {
    const res = await axiosClient.post("/api/reminders", {
      text,
      remindAt: new Date(reminderAt).toISOString(),
    });

    setReminders((prev) => [...prev, res.data]);
    setReminderText("");
    setReminderAt("");
  } catch {
    setEnrollNotice({ type: "error", text: "Failed to add reminder" });
  }
};


    

  const deleteReminder = async (id) => {
  try {
    await axiosClient.delete(`/api/reminders/${id}`);
    setReminders((prev) => prev.filter((r) => r.id !== id));
  } catch {
    setEnrollNotice({ type: "error", text: "Failed to delete reminder" });
  }
};


  const resetNoteForm = () => {
    setNoteTitle("");
    setNoteBody("");
    setEditingNoteId(null);
  };

  const addNote = async () => {
  if (!noteTitle.trim() && !noteBody.trim()) return;

  try {
    const res = await axiosClient.post("/api/notes", {
      title: noteTitle,
      body: noteBody,
    });

    setNotes((prev) => [res.data, ...prev]);
    resetNoteForm();
  } catch (e) {
    setEnrollNotice({ type: "error", text: "Failed to save note" });
    console.error(e);
  }
};

  const startEditNote = (note) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title || "");
    setNoteBody(note.body || "");
  };

 
const saveEditNote = async () => {
  try {
    const res = await axiosClient.put(`/api/notes/${editingNoteId}`, {
      title: noteTitle,
      body: noteBody,
    });

    setNotes((prev) =>
      prev.map((n) => (n.id === editingNoteId ? res.data : n))
    );

    resetNoteForm();
  } catch (e) {
    setEnrollNotice({ type: "error", text: "Failed to update note" });
  }
};
const deleteNote = async (id) => {
  try {
    await axiosClient.delete(`/api/notes/${id}`);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  } catch {
    setEnrollNotice({ type: "error", text: "Failed to delete note" });
  }
};


  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/courses");
      setCourses(res.data || []);
      setError(null);
    } catch (e) {
      setError("Failed to fetch courses.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEnrollments = async () => {
    try {
      // Requires token (protected)
      const res = await axiosClient.get("/api/enrollments/my");
      setEnrollments(res.data || []);
    } catch (e) {
      // If not logged in, this will fail (401/403). Keep UI usable.
      console.log("Enrollments not loaded (login required).");
    }
  };
  const fetchTodos = async () => {
  try {
    const res = await axiosClient.get("/api/todos");
    setTodos(res.data || []);
  } catch (e) {
    console.error("Failed to load todos");
  }
};

const fetchReminders = async () => {
  try {
    const res = await axiosClient.get("/api/reminders");
    setReminders(res.data || []);
  } catch (e) {
    console.error("Failed to load reminders");
  }
};



  const openPayModal = (course) => {
    setSelectedCourse(course);
    setSelectedMonth("January 2026");
    setPaymentMethod("card");
    setShowPayModal(true);
  };

  const closePayModal = () => {
    setShowPayModal(false);
    setSelectedCourse(null);
    setPayLoading(false);
  };

  const handlePay = async () => {
    if (!selectedCourse) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setEnrollNotice({ type: "error", text: "Please login first.", redirectTo: "/login" });
      return;
    }

    try {
      setPayLoading(true);

      await axiosClient.post(
        `/api/enrollments?courseId=${selectedCourse.id}&month=${encodeURIComponent(selectedMonth)}`
      );

      setEnrollNotice({ type: "success", text: "Enrolled successfully!" });
      closePayModal();
      fetchMyEnrollments();
      setActiveMenu("enrolled");
    } catch (e) {
      setEnrollNotice({ type: "error", text: "You are already enrolled for this month." });
      setPayLoading(false);
    }
  };

  const closeEnrollNotice = () => {
    const redirectTo = enrollNotice?.redirectTo;
    setEnrollNotice(null);
    if (redirectTo) navigate(redirectTo);
  };

  const filteredCourses = courses.filter((course) =>
    course.classname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCourses = (() => {
    const list = filteredCourses.slice();
    const safeText = (v) => String(v || "").toLowerCase();

    switch (sortOption) {
      case "price_asc":
        return list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
      case "price_desc":
        return list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
      case "month":
        return list.sort((a, b) => safeText(a.month).localeCompare(safeText(b.month)));
      case "teacher":
        return list.sort((a, b) => safeText(a.teachername).localeCompare(safeText(b.teachername)));
      default:
        return list;
    }
  })();

  const enrolledFiltered = (() => {
    const q = enrolledSearchTerm.trim().toLowerCase();
    if (!q) return enrollments;

    return enrollments.filter((e) => {
      const courseName = (e.course?.classname || "").toLowerCase();
      const teacherName = (e.course?.teachername || "").toLowerCase();
      const month = (e.month || "").toLowerCase();
      const status = (e.status || "").toLowerCase();
      return (
        courseName.includes(q) ||
        teacherName.includes(q) ||
        month.includes(q) ||
        status.includes(q)
      );
    });
  })();

  return (
    <div className="dashboard-layout">
      {enrollNotice && (
        <div className="enroll-popup-overlay" onClick={closeEnrollNotice}>
          <div
            className={`enroll-popup ${enrollNotice.type}`}
            role="dialog"
            aria-modal="true"
            aria-label="Enrollment message"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="enroll-popup-text">{enrollNotice.text}</div>
            <button type="button" className="enroll-popup-btn" onClick={closeEnrollNotice}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <div className="sidebar-title">Dashboard</div>

        <ul className="sidebar-menu">
          <li
            className={activeMenu === "all" ? "active" : ""}
            onClick={() => setActiveMenu("all")}
          >
            All Classes
          </li>

          <li
            className={activeMenu === "enrolled" ? "active" : ""}
            onClick={() => {
              setActiveMenu("enrolled");
              fetchMyEnrollments();
            }}
          >
            Enrolled Classes
          </li>

          <li
            className={activeMenu === "notes" ? "active" : ""}
            onClick={() => setActiveMenu("notes")}
          >
            Notes
          </li>

          <li
            className={activeMenu === "todos" ? "active" : ""}
            onClick={() => setActiveMenu("todos")}
          >
            To-Do
          </li>

          <li
            className={activeMenu === "settings" ? "active" : ""}
            onClick={() => setActiveMenu("settings")}
          >
            Settings
          </li>

          <li
            className={activeMenu === "aiquiz" ? "active" : ""}
            onClick={() => setActiveMenu("aiquiz")}
          >
            AI Quiz
          </li>
        </ul>

        <button
          type="button"
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </aside>

      {/* ===== Main Content ===== */}
      <div className="dashboard-content">
        <div className="dashboard-container">
          <header className="dashboard-header">
            <h1>Welcome to Your Classes Dashboard</h1>
            <p>Find your ideal classes and get ready to excel!</p>

            {activeMenu === "all" && (
              <div className="dashboard-controls">
                <input
                  type="search"
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  aria-label="Search classes"
                />

                <div className="sort-wrap">
                  <label className="sort-label" htmlFor="sortAll">
                    Sort by
                  </label>
                  <select
                    id="sortAll"
                    className="sort-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    aria-label="Sort all classes"
                  >
                    <option value="none">Default</option>
                    <option value="price_asc">Price (low to high)</option>
                    <option value="price_desc">Price (high to low)</option>
                    <option value="month">Month</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>
              </div>
            )}
          </header>

          <main className="dashboard-main">
            {activeMenu === "all" && (
              <>
                {loading && <p>Loading classes...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && !error && (
                  <div className="classes-grid">
                    {sortedCourses.map((c, idx) => (
                      <div key={c.id} className="class-card">
                        <div className="card-image">
                          <div className="card-badge" aria-hidden="true">{idx + 1}</div>
                          <img
                            src={resolvePublicUrl(c.photourl, { fallback: "/assets/class.jpg" })}
                            alt={c.classname}
                            loading="lazy"
                          />
                        </div>

                        <div className="card-content1">
                          <h3 className="card-title1">{c.classname}</h3>
                          <p className="card-month1">{c.month}</p>
                          <p className="card-price1">Price: {c.price}</p>
                          <p className="card-teacher1">
                            Teacher: {c.teachername}
                          </p>

                          <button
                            className="enroll-btn1"
                            onClick={() => openPayModal(c)}
                          >
                            ENROLL NOW
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}


            

            {activeMenu === "enrolled" && (
  <div className="enrolled-wrap">
    <h2 className="section-title">Your Enrolled Classes</h2>

    <input
      type="search"
      className="enrolled-search"
      placeholder="Search enrolled classes..."
      value={enrolledSearchTerm}
      onChange={(e) => setEnrolledSearchTerm(e.target.value)}
      aria-label="Search enrolled classes"
    />

    {enrolledFiltered.length === 0 ? (
      <p className="muted">No enrollments yet.</p>
    ) : (
      <div className="classes-grid">
        {enrolledFiltered.map((e, idx) => (
          <div key={e.id} className="class-card enrolled-card">
            
            {/* Course Image */}
            <div className="card-image">
              <div className="card-badge" aria-hidden="true">{idx + 1}</div>
              <img
                src={resolvePublicUrl(e.course?.photourl, { fallback: "/assets/class.jpg" })}
                alt={e.course?.classname}
              />
            </div>

            <div className="card-content1">
              <h3 className="card-title1">
                {e.course?.classname}
              </h3>

              <p className="card-month1">
                Month: {e.month}
              </p>

              <p className="card-teacher1">
                Teacher: {e.course?.teachername}
              </p>

              <p className="card-price1">
                Price: {e.course?.price}
              </p>

              <p className="card-status">
                Status: {e.status}
              </p>

              <button
                className="enroll-btn1"
                onClick={() => navigate(`/class/${e.course?.id}`)}
              >
                VIEW CLASS
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}


            {activeMenu === "notes" && (
              <div className="simple-box">
                <h2 className="section-title">Notes</h2>
                <p className="muted">Add, edit, and delete notes (saved securely to your account).</p>


                <form
                  className="notes-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingNoteId) saveEditNote();
                    else addNote();
                  }}
                >
                  <input
                    className="notes-title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Title"
                    aria-label="Note title"
                  />
                  <textarea
                    className="notes-body"
                    value={noteBody}
                    onChange={(e) => setNoteBody(e.target.value)}
                    placeholder="Write your note..."
                    rows={6}
                    aria-label="Note text"
                  />

                  <div className="notes-actions">
                    <button type="submit" className="notes-save">
                      {editingNoteId ? "Save" : "Add"}
                    </button>
                    {editingNoteId && (
                      <button
                        type="button"
                        className="notes-cancel"
                        onClick={resetNoteForm}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="divider" role="separator" />

                {notes.length === 0 ? (
                  <p className="muted">No notes yet.</p>
                ) : (
                  <ul className="notes-list">
                    {notes.map((n) => (
                      <li key={n.id} className="notes-item">
                        <div className="notes-item-main">
                          <div className="notes-item-title">{n.title}</div>
                          {n.body ? (
                            <div className="notes-item-body">{n.body}</div>
                          ) : (
                            <div className="notes-item-body notes-item-body--empty">
                              (empty)
                            </div>
                          )}
                          <div className="notes-item-time">
                            {new Date(n.updatedAt || n.createdAt).toLocaleString()}
                          </div>
                        </div>

                        <div className="notes-item-actions">
                          <button
                            type="button"
                            className="notes-edit"
                            onClick={() => startEditNote(n)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="notes-delete"
                            onClick={() => deleteNote(n.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeMenu === "todos" && (
              <div className="simple-box">
                <h2 className="section-title">To-Do</h2>
                <p className="muted">Saved on this device only.</p>

                <form
                  className="todo-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addTodo();
                  }}
                >
                  <input
                    className="todo-input"
                    value={todoText}
                    onChange={(e) => setTodoText(e.target.value)}
                    placeholder="Add a new task..."
                    aria-label="Add a new task"
                  />
                  <button type="submit" className="todo-add-btn">
                    Add
                  </button>
                </form>

                {todos.length === 0 ? (
                  <p className="muted">No tasks yet.</p>
                ) : (
                  <ul className="todo-list">
                    {todos.map((t) => (
                      <li
                        key={t.id}
                        className={t.done ? "todo-item todo-item--done" : "todo-item"}
                      >
                        <label className="todo-check">
                          <input
                            type="checkbox"
                            checked={t.done}
                            onChange={() => toggleTodo(t)}
                          />
                          <span className="todo-text">{t.text}</span>
                        </label>

                        <button
                          type="button"
                          className="todo-delete"
                          onClick={() => deleteTodo(t.id)}
                          aria-label={`Delete task: ${t.text}`}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="divider" role="separator" />

                <h3 className="sub-title">Reminders</h3>
                <p className="muted">Add a reminder with date & time.</p>

                <form
                  className="reminder-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addReminder();
                  }}
                >
                  <input
                    className="reminder-input"
                    value={reminderText}
                    onChange={(e) => setReminderText(e.target.value)}
                    placeholder="Reminder text..."
                    aria-label="Reminder text"
                  />
                  <input
                    className="reminder-dt"
                    type="datetime-local"
                    value={reminderAt}
                    onChange={(e) => setReminderAt(e.target.value)}
                    aria-label="Reminder date and time"
                  />
                  <button type="submit" className="reminder-add-btn">
                    Add
                  </button>
                </form>

                {reminders.length === 0 ? (
                  <p className="muted">No reminders yet.</p>
                ) : (
                  <ul className="reminder-list">
                    {reminders
                      .slice()
                     .sort(
                 (a, b) => new Date(a.remindAt) - new Date(b.remindAt))

                      .map((r) => (
                        <li key={r.id} className="reminder-item">
                          <div className="reminder-main">
                            <div className="reminder-text">{r.text}</div>
                            <div className="reminder-time">
                              {new Date(r.remindAt).toLocaleString()
}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="reminder-delete"
                            onClick={() => deleteReminder(r.id)}
                            aria-label={`Delete reminder: ${r.text}`}
                            title="Delete"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            )}

            {activeMenu === "settings" && (
              <div className="simple-box">
                <h2 className="section-title">Settings</h2>
                <p className="muted">Update your email and password.</p>

                {profileLoading && <p>Loading profile...</p>}
                {profileError && <p className="error-message">{profileError}</p>}

                {settingsMessage && (
                  <p className={settingsMessage.type === "success" ? "success-message" : "error-message"}>
                    {settingsMessage.text}
                  </p>
                )}

                {!profileLoading && !profileError && (
                  <form className="settings-form" onSubmit={saveSettings}>
                    <div className="form-row">
                      <label className="form-label">Username</label>
                      <input
                        className="form-input"
                        value={profile?.username || ""}
                        readOnly
                        aria-label="Username"
                      />
                    </div>

                    <div className="form-row">
                      <label className="form-label">Email</label>
                      <input
                        className="form-input"
                        type="email"
                        value={settingsEmail}
                        onChange={(e) => setSettingsEmail(e.target.value)}
                        placeholder="Email"
                        aria-label="Email"
                      />
                    </div>

                    <div className="divider" role="separator" />

                    <div className="form-row">
                      <label className="form-label">Current Password</label>
                      <input
                        className="form-input"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current password"
                        aria-label="Current password"
                      />
                    </div>

                    <div className="form-row">
                      <label className="form-label">New Password</label>
                      <input
                        className="form-input"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                        aria-label="New password"
                      />
                    </div>

                    <div className="form-row">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        className="form-input"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        aria-label="Confirm new password"
                      />
                    </div>

                    <button type="submit" className="save-btn" disabled={settingsSaving}>
                      {settingsSaving ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {activeMenu === "aiquiz" && (
              <div className="simple-box">
                <h2 className="section-title">AI Quiz Generator</h2>
                <p className="muted">Generate A/L level MCQs for any topic.</p>

                {quizError && <p className="error-message">{quizError}</p>}

                <form className="settings-form" onSubmit={handleGenerateQuiz}>
                  <div className="form-row">
                    <label className="form-label">Subject</label>
                    <select
                      className="form-input"
                      value={quizSubject}
                      onChange={(e) => setQuizSubject(e.target.value)}
                      aria-label="Quiz subject"
                    >
                      <option value="Biology">Biology</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Physics">Physics</option>
                      <option value="ICT">ICT</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label className="form-label">Topic</label>
                    <input
                      className="form-input"
                      value={quizTopic}
                      onChange={(e) => setQuizTopic(e.target.value)}
                      placeholder="e.g., Photosynthesis"
                      aria-label="Quiz topic"
                    />
                  </div>

                  <div className="form-row">
                    <label className="form-label">Difficulty</label>
                    <select
                      className="form-input"
                      value={quizDifficulty}
                      onChange={(e) => setQuizDifficulty(e.target.value)}
                      aria-label="Quiz difficulty"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label className="form-label">Number of Questions</label>
                    <input
                      className="form-input"
                      type="number"
                      min={1}
                      max={20}
                      value={quizCount}
                      onChange={(e) => setQuizCount(e.target.value)}
                      aria-label="Number of questions"
                    />
                  </div>

                  <button type="submit" className="save-btn" disabled={quizLoading}>
                    {quizLoading ? "GENERATING..." : "GENERATE QUIZ"}
                  </button>
                </form>

                {quizItems.length > 0 && (
                  <div className="quiz-list" aria-label="Generated quiz">
                    <div className="quiz-actions">
                      <div className="quiz-meta">
                        {quizChecked && quizScore != null
                          ? `Score: ${quizScore}/${quizItems.length}`
                          : "Select answers, then check results."}
                      </div>

                      <div className="quiz-btn-row">
                        <button
                          type="button"
                          className="quiz-file-btn"
                          onClick={downloadQuizPdf}
                          disabled={quizLoading || quizItems.length === 0}
                        >
                          Download PDF
                        </button>

                        <button
                          type="button"
                          className="quiz-check-btn"
                          onClick={checkQuizResults}
                          disabled={quizLoading || quizItems.length === 0}
                        >
                          Check Results
                        </button>
                      </div>
                    </div>

                    {quizItems.map((q, idx) => (
                      <div key={idx} className="quiz-card">
                        <div className="quiz-q">
                          {idx + 1}. {q.question}
                        </div>
                        <ul className="quiz-options">
                          {q.options.map((opt, oi) => (
                            <li key={oi} className="quiz-opt">
                              <label
                                className={(() => {
                                  const selected = quizAnswers[idx] === oi;
                                  if (!quizChecked) return selected ? "quiz-opt-label quiz-opt-selected" : "quiz-opt-label";
                                  const isCorrect = oi === q.correctIndex;
                                  const isWrongSelected = selected && !isCorrect;
                                  if (isCorrect) return "quiz-opt-label quiz-opt-correct";
                                  if (isWrongSelected) return "quiz-opt-label quiz-opt-wrong";
                                  return selected ? "quiz-opt-label quiz-opt-selected" : "quiz-opt-label";
                                })()}
                              >
                                <input
                                  type="radio"
                                  name={`q-${idx}`}
                                  checked={quizAnswers[idx] === oi}
                                  onChange={() => selectQuizAnswer(idx, oi)}
                                  disabled={quizChecked}
                                />
                                <span className="quiz-opt-text">
                                  {String.fromCharCode(65 + oi)}. {opt}
                                </span>
                              </label>
                            </li>
                          ))}
                        </ul>
                        
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

           
          </main>
        </div>
      </div>

      {/* ===== Payment Modal ===== */}
      {showPayModal && selectedCourse && (
        <div className="modal-overlay" onClick={closePayModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Payment</h2>

            <div className="modal-row">
              <span className="muted">Class:</span>
              <strong>{selectedCourse.classname}</strong>
            </div>

            <div className="modal-row">
              <span className="muted">Price:</span>
              <strong>{selectedCourse.price}</strong>
            </div>

            <label className="modal-label">Select Month</label>
            <select
              className="modal-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option>January 2026</option>
              <option>February 2026</option>
              <option>March 2026</option>
              <option>April 2026</option>
              <option>May 2026</option>
              <option>June 2026</option>
            </select>

            <label className="modal-label">Payment Method</label>
            <div className="payment-options">
              <label className="radio">
                <input
                  type="radio"
                  name="pay"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                Card
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="pay"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                Cash
              </label>
            </div>

            <button
              className="pay-btn"
              onClick={handlePay}
              disabled={payLoading}
            >
              {payLoading ? "PROCESSING..." : "PAY & ENROLL"}
            </button>

            <button className="close-btn" onClick={closePayModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
