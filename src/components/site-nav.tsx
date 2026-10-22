import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const META = ["Mon 09:15", "CHN F 42", "Sprache: German"];

export function Brand() {
  return (
    <span className="font-mono text-sm font-bold tracking-widest">
      A&amp;P <span className="text-primary">//</span> ETH ZÜRICH
    </span>
  );
}

export function MetaBadges() {
  return (
    <div className="flex divide-x divide-border border border-border font-mono text-[11px] uppercase tracking-widest">
      {META.map((b) => <span key={b} className="px-3 py-1.5">{b}</span>)}
    </div>
  );
}

const navCls = "px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors hover:text-primary";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-foreground bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <Link to="/"><Brand /></Link>
          <nav className="flex items-center gap-1">
            <Link to="/" className={navCls} activeOptions={{ exact: true }}>Home</Link>
            <Link to="/materials" className={navCls} activeProps={{ className: "text-primary underline underline-offset-8" }}>01 Materials</Link>
            <Link to="/lab" className={navCls} activeProps={{ className: "text-primary underline underline-offset-8" }}>02 Lab</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6">{children}</main>
      <footer className="border-t border-foreground">
        <div className="mx-auto flex max-w-6xl justify-between px-6 py-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <span>A&amp;P TA Page</span><span>ETH Zürich · D-INFK</span>
        </div>
      </footer>
    </div>
  );
}
