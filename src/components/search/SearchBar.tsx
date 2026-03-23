"use client";

import { useCallback, useEffect, useRef, type KeyboardEvent } from "react";

type SearchBarProps = {
  query: string;
  onQueryChange: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export function SearchBar({ query, onQueryChange, onSubmit, isLoading }: SearchBarProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [query, resize]);

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-base)_95%,transparent)] px-6 py-4 backdrop-blur-md">
      <div
        className="group flex items-end gap-3 rounded-xl border-[0.5px] border-[var(--border-md)] bg-[var(--bg-card)] px-4 py-3 transition-all duration-200 hover:border-[var(--green-border)] focus-within:border-[color-mix(in_srgb,var(--green)_50%,transparent)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--green)_8%,transparent)] sm:gap-4"
      >
        <div className="grid h-[28px] w-[28px] shrink-0 place-items-center rounded-lg bg-[var(--green-light)]">
          <span className="text-[14px] font-light leading-none text-[var(--green)]">✦</span>
        </div>
        <textarea
          ref={taRef}
          rows={1}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask anything about NFL stats..."
          className="min-h-[24px] w-full resize-none border-0 bg-transparent py-1 text-[14px] leading-relaxed text-[var(--txt)] outline-none placeholder:text-[var(--txt-3)]"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !query.trim()}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--green)] px-4 py-2 text-[13px] font-bold text-[var(--on-green)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--on-green)] border-t-transparent"
                aria-hidden
              />
              Thinking...
            </>
          ) : (
            "Ask the Guru ✦"
          )}
        </button>
      </div>
    </div>
  );
}
