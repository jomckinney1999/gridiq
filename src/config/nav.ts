export const PRIMARY_NAV = [
  { href: "/", label: "Home" },
  { href: "/trending", label: "Trending" },
  { href: "/guru-score", label: "Guru Score" },
  { href: "/stats-school", label: "Stats School" },
  { href: "/games", label: "Games" },
  { href: "/prospects", label: "Prospects" },
  { href: "/fantasy", label: "Fantasy" },
  { href: "/betting", label: "Betting" },
  { href: "/content", label: "Content" },
  { href: "/courses", label: "Courses" },
] as const;

/** Icons for collapsed sidebar (md width). */
export const PRIMARY_NAV_SIDEBAR_ICONS = ["⌂", "📈", "📊", "📚", "🎮", "◇", "🏆", "💰", "📺", "🎓"] as const;

export function isActiveNav(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/games") {
    return pathname === "/games" || pathname.startsWith("/games/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
