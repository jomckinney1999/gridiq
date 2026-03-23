function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.']/g, "");
}

/**
 * Accept full name, last name only, or alias (case-insensitive).
 */
export function matchesStatGridAnswer(
  guess: string,
  answer: string,
  aliases: string[],
): boolean {
  const g = normalize(guess);
  if (!g) return false;

  const full = normalize(answer);
  if (g === full) return true;

  const parts = full.split(" ").filter(Boolean);
  const last = parts[parts.length - 1] ?? "";
  if (last && g === last) return true;

  if (parts.length >= 2) {
    const first = parts[0] ?? "";
    if (g === first) return true;
  }

  for (const a of aliases) {
    const na = normalize(a);
    if (g === na) return true;
    if (last && na === last) return true;
  }

  return false;
}
