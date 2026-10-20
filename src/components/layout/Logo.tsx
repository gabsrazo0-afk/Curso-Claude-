import Link from "next/link";

export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="cca-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7867FF" />
          <stop offset="1" stopColor="#35D6C3" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#cca-mark)" />
      <path
        d="M13 14.5 18.5 20 13 25.5"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21.5 26h6" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 rounded-xl" aria-label="Claude Code Academy, ir al panel">
      <LogoMark />
      <span className="leading-tight">
        <span className="block text-[0.95rem] font-semibold tracking-tight text-fg">Claude Code</span>
        <span className="block font-mono text-[0.65rem] uppercase tracking-[0.22em] text-fg-muted">
          Academy
        </span>
      </span>
    </Link>
  );
}
