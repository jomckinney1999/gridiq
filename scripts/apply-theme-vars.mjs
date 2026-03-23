import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "..", "src");

const REPLACEMENTS = [
  ["hover:shadow-[0_0_28px_rgba(0,255,135,0.35)]", "hover:shadow-[var(--shadow-glow-g)]"],
  ["hover:shadow-[0_0_26px_rgba(0,255,135,0.35)]", "hover:shadow-[var(--shadow-glow-g)]"],
  ["shadow-[0_0_28px_rgba(0,255,135,0.35)]", "shadow-[var(--shadow-glow-g)]"],
  ["shadow-[0_0_26px_rgba(0,255,135,0.35)]", "shadow-[var(--shadow-glow-g)]"],
  ["shadow-[0_0_24px_rgba(0,255,135,0.25)]", "shadow-[var(--shadow-glow-g)]"],
  ["shadow-[0_0_20px_rgba(0,255,135,0.25)]", "shadow-[var(--shadow-glow-g)]"],
  ["shadow-[0_0_20px_rgba(0,255,135,0.08)]", "shadow-[var(--shadow-glow-g)]"],
  ["shadow-[0_0_18px_rgba(0,255,135,0.25)]", "shadow-[var(--shadow-glow-g)]"],
  ["shadow-[0_0_40px_rgba(0,0,0,0.45)]", "shadow-[var(--shadow-glow-soft)]"],
  ["shadow-[-8px_0_32px_rgba(0,0,0,0.45)]", "shadow-[var(--shadow-md)]"],
  ["shadow-lg", "shadow-[var(--shadow-md)]"],
  ["border-b-[0.5px] border-[rgba(255,255,255,0.06)]", "border-b-[0.5px] border-[var(--border)]"],
  ["border-[rgba(255,255,255,0.06)]", "border-[var(--border)]"],
  ["border-[rgba(255,255,255,0.08)]", "border-[var(--border)]"],
  ["border-[rgba(255,255,255,0.1)]", "border-[var(--border-md)]"],
  ["border-[rgba(255,255,255,0.12)]", "border-[var(--border-md)]"],
  ["border-[rgba(0,255,135,0.2)]", "border-[var(--green-border)]"],
  ["border-[rgba(0,255,135,0.25)]", "border-[var(--green-border)]"],
  ["border-[rgba(0,255,135,0.28)]", "border-[color-mix(in_srgb,var(--green)_28%,transparent)]"],
  ["border-[rgba(0,255,135,0.35)]", "border-[var(--green-border)]"],
  ["border-[rgba(0,255,135,0.45)]", "border-[var(--green-border)]"],
  ["border-[rgba(255,107,43,0.25)]", "border-[color-mix(in_srgb,var(--orange)_25%,transparent)]"],
  ["border-[rgba(255,107,43,0.35)]", "border-[color-mix(in_srgb,var(--orange)_35%,transparent)]"],
  ["border-[rgba(255,107,43,0.2)]", "border-[color-mix(in_srgb,var(--orange)_20%,transparent)]"],
  ["divide-[rgba(255,255,255,0.06)]", "divide-[var(--border)]"],
  ["hover:border-[rgba(255,255,255,0.2)]", "hover:border-[var(--border-md)]"],
  ["hover:border-[rgba(255,255,255,0.18)]", "hover:border-[var(--border-md)]"],
  ["hover:border-[rgba(255,255,255,0.14)]", "hover:border-[var(--border-md)]"],
  ["hover:border-[rgba(0,255,135,0.35)]", "hover:border-[var(--green-border)]"],
  ["hover:border-[rgba(0,255,135,0.3)]", "hover:border-[var(--green-border)]"],
  ["hover:border-[rgba(0,255,135,0.2)]", "hover:border-[var(--green-border)]"],
  ["hover:bg-[rgba(255,255,255,0.04)]", "hover:bg-[color-mix(in_srgb,var(--txt)_4%,transparent)]"],
  ["bg-[rgba(255,255,255,0.04)]", "bg-[var(--bg-subtle)]"],
  ["bg-[rgba(255,255,255,0.035)]", "bg-[var(--bg-subtle)]"],
  ["bg-[rgba(255,255,255,0.06)]", "bg-[var(--bg-subtle-2)]"],
  ["bg-[rgba(0,255,135,0.14)]", "bg-[var(--green-light)]"],
  ["bg-[rgba(0,255,135,0.12)]", "bg-[var(--green-light)]"],
  ["bg-[rgba(0,255,135,0.1)]", "bg-[var(--green-light)]"],
  ["bg-[rgba(0,255,135,0.08)]", "bg-[var(--green-light)]"],
  ["bg-[rgba(0,255,135,0.06)]", "bg-[var(--green-light)]"],
  ["bg-[rgba(255,107,43,0.12)]", "bg-[var(--orange-light)]"],
  ["bg-[rgba(255,107,43,0.08)]", "bg-[var(--orange-light)]"],
  ["bg-[rgba(59,158,255,0.12)]", "bg-[var(--blue-light)]"],
  ["bg-[rgba(59,158,255,0.08)]", "bg-[var(--blue-light)]"],
  ["bg-[rgba(59,158,255,0.06)]", "bg-[var(--blue-light)]"],
  ["bg-[rgba(168,85,247,0.12)]", "bg-[var(--purple-light)]"],
  ["bg-[rgba(168,85,247,0.08)]", "bg-[var(--purple-light)]"],
  ["bg-[rgba(5,5,7,0.95)]", "bg-[color-mix(in_srgb,var(--bg-base)_95%,transparent)]"],
  ["bg-black/60", "bg-[var(--overlay-scrim)]"],
  ["bg-gradient-to-r from-[#00ff87] via-[#3b9eff] to-[#ff6b2b]", "bg-gradient-to-r from-[var(--green)] via-[var(--blue)] to-[var(--orange)]"],
  ["from-[#00ff87]", "from-[var(--green)]"],
  ["via-[#3b9eff]", "via-[var(--blue)]"],
  ["to-[#ff6b2b]", "to-[var(--orange)]"],
  ["hover:text-[#ff8f5a]", "hover:text-[var(--orange)]"],
  ["hover:text-[#f2f2f5]", "hover:text-[var(--txt)]"],
  ["hover:text-[#00ff87]", "hover:text-[var(--green)]"],
  ["text-[#b8f5d6]", "text-[var(--green)]"],
  ["text-[#f2f2f5]", "text-[var(--txt)]"],
  ["text-[#8888a0]", "text-[var(--txt-2)]"],
  ["text-[#44445a]", "text-[var(--txt-3)]"],
  ["text-[#55556a]", "text-[var(--txt-muted)]"],
  ["text-[#b8b8c8]", "text-[var(--txt-2)]"],
  ["bg-[#050507]", "bg-[var(--bg-base)]"],
  ["bg-[#0d0d10]", "bg-[var(--bg-card)]"],
  ["bg-[#111116]", "bg-[var(--bg-card2)]"],
  ["bg-[#0a0a0c]", "bg-[var(--bg-secondary)]"],
  ["bg-[#00ff87]", "bg-[var(--green)]"],
  ["bg-[#3b9eff]", "bg-[var(--blue)]"],
  ["bg-[#ff6b2b]", "bg-[var(--orange)]"],
  ["text-[#00ff87]", "text-[var(--green)]"],
  ["text-[#ff6b2b]", "text-[var(--orange)]"],
  ["text-[#3b9eff]", "text-[var(--blue)]"],
  ["text-[#a855f7]", "text-[var(--purple)]"],
  ["border-[#00ff87]", "border-[var(--green)]"],
  ["text-[#050507]", "text-[var(--on-green)]"],
  ["border-[#050507]", "border-[var(--on-green)]"],
  ["ring-[#00ff87]", "ring-[var(--green)]"],
];

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules") continue;
      walk(p, files);
    } else if (/\.(tsx|ts)$/.test(e.name) && !e.name.endsWith(".d.ts")) {
      files.push(p);
    }
  }
  return files;
}

for (const f of walk(srcDir)) {
  let s = fs.readFileSync(f, "utf8");
  const orig = s;
  for (const [a, b] of REPLACEMENTS) {
    s = s.split(a).join(b);
  }
  if (s !== orig) {
    fs.writeFileSync(f, s);
    console.log(path.relative(path.join(__dirname, ".."), f));
  }
}
