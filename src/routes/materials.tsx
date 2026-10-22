import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-nav";
import { WEEKS } from "@/components/course";

export const Route = createFileRoute("/materials")({
  head: () => ({
    meta: [
      { title: "Course Materials — A&P // ETH Zürich" },
      { name: "description", content: "Wochenübersicht der A&W-Übungsstunden: Graphen, Wahrscheinlichkeit, randomisierte Algorithmen, Flows und Geometrie." },
      { property: "og:title", content: "Course Materials — A&P // ETH Zürich" },
      { property: "og:description", content: "Alle Wochen und Themen der A&W-Übungsstunde." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Materials,
});

function Materials() {
  const [open, setOpen] = useState<string | null>("14");
  return (
    <SiteShell>
      <section className="grid gap-8 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-3">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">§ 01</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Course Materials</h1>
        </div>
        <ul className="border-t border-foreground md:col-span-9">
          {WEEKS.map(([n, title, topics]) => {
            const isOpen = open === n;
            return (
              <li key={n} className="border-b border-border">
                <button onClick={() => setOpen(isOpen ? null : n)} aria-expanded={isOpen}
                  className="group grid w-full grid-cols-[90px_1fr_auto] items-baseline gap-4 py-5 text-left">
                  <span className={`font-mono text-xs tracking-widest ${isOpen ? "text-primary" : "text-muted-foreground"}`}>WEEK {n}</span>
                  <span className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary md:text-2xl">{title}</span>
                  <span className="font-mono text-lg text-muted-foreground">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="grid grid-cols-[90px_1fr] gap-4 pb-6">
                    <span />
                    <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
                      {topics.split(", ").map((t) => <span key={t}><span className="text-primary">—</span> {t}</span>)}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </SiteShell>
  );
}
