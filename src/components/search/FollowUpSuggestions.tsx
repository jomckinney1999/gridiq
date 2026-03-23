"use client";

type FollowUpSuggestionsProps = {
  suggestions: string[];
  onPick: (s: string) => void;
};

export function FollowUpSuggestions({ suggestions, onPick }: FollowUpSuggestionsProps) {
  if (!suggestions.length) return null;

  return (
    <div>
      <div className="text-[11px] font-medium text-[var(--txt-3)]">Ask a follow-up</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-full border border-[var(--border-md)] bg-transparent px-3 py-1.5 text-left text-[12px] text-[var(--txt-2)] transition hover:border-[var(--green-border)] hover:bg-[var(--green-light)] hover:text-[var(--green)]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
