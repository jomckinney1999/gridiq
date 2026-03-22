"use client";

type FollowUpSuggestionsProps = {
  suggestions: string[];
  onPick: (s: string) => void;
};

export function FollowUpSuggestions({ suggestions, onPick }: FollowUpSuggestionsProps) {
  if (!suggestions.length) return null;

  return (
    <div>
      <div className="text-[11px] font-medium text-[#44445a]">Ask a follow-up</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-full border border-[rgba(255,255,255,0.1)] bg-transparent px-3 py-1.5 text-left text-[12px] text-[#8888a0] transition hover:border-[rgba(0,255,135,0.35)] hover:bg-[rgba(0,255,135,0.06)] hover:text-[#00ff87]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
