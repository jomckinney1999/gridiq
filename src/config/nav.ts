export const PRIMARY_NAV = [
  { href: "/", label: "Home" },
  { href: "/trending", label: "Trending" },
  { href: "/stats-school", label: "Stats School" },
  { href: "/prospects", label: "Prospects" },
  { href: "/fantasy", label: "Fantasy" },
  { href: "/betting", label: "Betting" },
] as const;

/** Icons for collapsed sidebar (md width). */
export const PRIMARY_NAV_SIDEBAR_ICONS = ["⌂", "📈", "📚", "◇", "🏆", "◆"] as const;

export function isActiveNav(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
