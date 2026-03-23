"use client";

import { useLayoutEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      }
    } catch {
      /* ignore */
    }
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="flex items-center gap-1.5 rounded-full border border-[var(--border-md)] bg-[var(--bg-card2)] px-3 py-1.5 font-[inherit] text-[12px] font-semibold text-[var(--txt-2)] transition-[background-color,border-color,color] duration-200"
    >
      <div
        className="relative h-[18px] w-8 shrink-0 rounded-full transition-colors duration-200"
        style={{
          background: dark ? "var(--green)" : "var(--border-md)",
        }}
      >
        <div
          className="absolute top-0.5 h-3.5 w-3.5 rounded-full bg-[var(--inverse)] shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-[left] duration-200"
          style={{ left: dark ? "16px" : "2px" }}
        />
      </div>
      <span>{dark ? "🌙 Dark" : "☀️ Light"}</span>
    </button>
  );
}
