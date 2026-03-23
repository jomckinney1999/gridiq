export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="34" fill="#0a1a0e" stroke="#00ff87" strokeWidth="1"/>
        <circle cx="36" cy="36" r="28" fill="none" stroke="#00ff87" strokeWidth="0.5" opacity="0.2"/>
        <circle cx="36" cy="36" r="22" fill="none" stroke="#00ff87" strokeWidth="0.5" opacity="0.15"/>
        <ellipse cx="36" cy="52" rx="14" ry="5" fill="#00ff87" opacity="0.15"/>
        <path d="M22 50 Q28 44 36 46 Q44 44 50 50" fill="#00ff87" opacity="0.7"/>
        <rect x="30" y="32" width="12" height="16" rx="6" fill="#00ff87" opacity="0.9"/>
        <circle cx="36" cy="26" r="8" fill="#00ff87"/>
        <circle cx="36" cy="26" r="4" fill="#0a1a0e" opacity="0.4"/>
        <line x1="30" y1="38" x2="22" y2="32" stroke="#00ff87" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
        <line x1="42" y1="38" x2="50" y2="32" stroke="#00ff87" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
        <ellipse cx="36" cy="12" rx="7" ry="5" fill="none" stroke="#ff6b2b" strokeWidth="1.2" opacity="0.9"/>
        <line x1="29" y1="12" x2="43" y2="12" stroke="#ff6b2b" strokeWidth="0.8" opacity="0.9"/>
        <line x1="31" y1="9" x2="31" y2="15" stroke="#ff6b2b" strokeWidth="0.8" opacity="0.8"/>
        <line x1="36" y1="7.5" x2="36" y2="16.5" stroke="#ff6b2b" strokeWidth="0.8" opacity="0.8"/>
        <line x1="41" y1="9" x2="41" y2="15" stroke="#ff6b2b" strokeWidth="0.8" opacity="0.8"/>
        <circle cx="18" cy="28" r="2" fill="#00ff87" opacity="0.5"/>
        <circle cx="54" cy="28" r="2" fill="#ff6b2b" opacity="0.5"/>
        <circle cx="16" cy="40" r="1.5" fill="#3b9eff" opacity="0.4"/>
        <circle cx="56" cy="40" r="1.5" fill="#00ff87" opacity="0.4"/>
      </svg>
      <span
        style={{
          fontSize: "17px",
          fontWeight: 700,
          letterSpacing: "-0.5px",
          color: "var(--txt)",
        }}
      >
        NFL Stat <span style={{ color: "var(--green)" }}>Guru</span>
      </span>
    </div>
  )
}
