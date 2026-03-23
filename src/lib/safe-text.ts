/** Coerce unknown API values so React never renders [object Object]. */
export function safeText(value: unknown, fallback = "—"): string {
  if (value == null || value === "") return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return value.toLocaleString();
  return fallback;
}

export function safeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((x) => {
      if (typeof x === "string") return x;
      if (x == null) return "";
      if (typeof x === "number" || typeof x === "boolean") return String(x);
      return "";
    })
    .filter(Boolean);
}
