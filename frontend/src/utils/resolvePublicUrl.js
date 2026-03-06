// Resolves image/file URLs when assets live under /public (e.g. /public/assets/*)
// - Keeps absolute URLs (http/https) as-is
// - Makes relative paths absolute (prefixes with /)
// - If a bare filename is provided (e.g. lec6.png), assumes it lives under /assets/
export function resolvePublicUrl(raw, { fallback = "" } = {}) {
  if (raw == null) return fallback;

  const value = String(raw).trim();
  if (!value) return fallback;

  const normalized = value.replace(/\\/g, "/");

  // Absolute URLs (including protocol-relative)
  if (/^(https?:)?\/\//i.test(normalized)) return normalized;

  // Already absolute
  if (normalized.startsWith("/")) return normalized;

  // Legacy / common authoring patterns
  // e.g. src/assets/x.png -> /assets/x.png
  if (normalized.includes("src/assets/")) {
    return `/assets/${normalized.split("src/assets/").pop()}`;
  }
  // e.g. ../assets/x.png or ./assets/x.png -> /assets/x.png
  if (normalized.includes("../assets/") || normalized.includes("./assets/")) {
    return `/assets/${normalized.split("assets/").pop()}`;
  }
  // e.g. public/assets/x.png -> /assets/x.png
  if (normalized.includes("public/assets/")) {
    return `/assets/${normalized.split("public/assets/").pop()}`;
  }
  // e.g. frontend/public/assets/x.png -> /assets/x.png
  if (normalized.includes("/public/assets/")) {
    return `/assets/${normalized.split("/public/assets/").pop()}`;
  }

  // Common cases
  if (normalized.startsWith("assets/")) return `/${normalized}`;
  if (normalized.startsWith("public/")) return `/${normalized.slice("public/".length)}`;

  // Relative path (e.g. uploads/x.png) -> make it absolute
  if (normalized.includes("/")) return `/${normalized}`;

  // Bare filename -> assume /assets
  return `/assets/${normalized}`;
}
