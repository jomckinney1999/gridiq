/** NFL-oriented calendar day (US Eastern) for daily puzzles. */
export function getEasternDateString(d = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function getYesterdayEastern(): string {
  return getEasternDateString(new Date(Date.now() - 86400000));
}
