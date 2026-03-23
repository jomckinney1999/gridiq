export type ContentCategory = "Fantasy" | "Advanced Stats" | "Prospects" | "Betting" | "Courses";

export const CATEGORY_ACCENT: Record<
  ContentCategory,
  { border: string; badge: string; pill: string }
> = {
  Fantasy: {
    border: "border-l-4 border-l-[var(--green)]",
    badge: "border-[var(--green-border)] bg-[var(--green-light)] text-[var(--green)]",
    pill: "bg-[var(--green-light)] text-[var(--green)]",
  },
  "Advanced Stats": {
    border: "border-l-4 border-l-[var(--blue)]",
    badge: "border-[color-mix(in_srgb,var(--blue)_30%,transparent)] bg-[var(--blue-light)] text-[var(--blue)]",
    pill: "bg-[var(--blue-light)] text-[var(--blue)]",
  },
  Prospects: {
    border: "border-l-4 border-l-[var(--purple)]",
    badge: "border-[color-mix(in_srgb,var(--purple)_30%,transparent)] bg-[var(--purple-light)] text-[var(--purple)]",
    pill: "bg-[var(--purple-light)] text-[var(--purple)]",
  },
  Betting: {
    border: "border-l-4 border-l-[var(--orange)]",
    badge: "border-[color-mix(in_srgb,var(--orange)_30%,transparent)] bg-[var(--orange-light)] text-[var(--orange)]",
    pill: "bg-[var(--orange-light)] text-[var(--orange)]",
  },
  Courses: {
    border: "border-l-4 border-l-[var(--blue)]",
    badge: "border-[color-mix(in_srgb,var(--blue)_25%,transparent)] bg-[var(--blue-light)] text-[var(--blue)]",
    pill: "bg-[var(--blue-light)] text-[var(--blue)]",
  },
};
