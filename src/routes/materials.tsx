import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site-nav";
import { WEEKS } from "@/components/course";

export const Route = createFileRoute("/materials")({
  head: () => ({
    meta: [
      { title: "Course Materials — A&W // ju ngwa" },
      { name: "description", content: "Wochenübersicht der A&W-Übungsstunden: Graphen, Wahrscheinlichkeit, randomisierte Algorithmen, Flows und Geometrie." },
      { property: "og:title", content: "Course Materials — A&W" },
      { property: "og:description", content: "Alle Wochen und Themen der A&W-Übungsstunde." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Materials,
});

function Materials() {
  const [selected, setSelected] = useState("14");
  const [preview, setPreview] = useState<string | null>(null);
  const current = WEEKS.find(([n]) => n === (preview ?? selected)) ?? WEEKS[0];
  return (
    <SiteShell>
      <section className="materials-page workspace-page">
        <div className="workspace-heading flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-primary">§ 01</p>
            <h1 className="mt-2 text-3xl font-bold">Course Materials</h1>
          </div>
          <span className="font-mono text-xs text-muted-foreground">13 WOCHEN · FS 2027</span>
        </div>
        <ul className="weeks-grid" onMouseLeave={() => setPreview(null)}>
          {WEEKS.map(([n, title]) => (
            <li key={n}>
              <Button variant="ghost" aria-pressed={selected === n}
                onMouseEnter={() => setPreview(n)} onFocus={() => setPreview(n)}
                onBlur={() => setPreview(null)} onClick={() => { setSelected(n); setPreview(null); }}
                className={`week-choice group ${selected === n ? "bg-accent text-accent-foreground" : ""}`}>
                <span className="font-mono text-[11px] text-muted-foreground">WEEK {n}</span>
                <span className="week-title">{title}</span>
                <ArrowUpRight className="week-arrow text-primary" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
        {current && <div className="week-detail" aria-label="Wochenthemen">
          <p className="font-mono text-xs text-primary">WEEK {current[0]} / {current[1]}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {current[2].split(", ").map((topic) => <span key={topic}><span className="text-primary">—</span> {topic}</span>)}
          </div>
        </div>}
      </section>
    </SiteShell>
  );
}
