import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-nav";
import { Simulator } from "@/components/course";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Algorithm Simulator — A&W " },
      { name: "description", content: "Interaktiver Simulator für Algorithmen: Tarjan, Euler Tour, Max Flow, Min-Cut, Convex Hull und mehr." },
      { property: "og:title", content: "Algorithm Simulator — A&W" },
      { property: "og:description", content: "Algorithmen Schritt für Schritt visualisiert." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Lab,
});

function Lab() {
  return (
    <SiteShell>
      <section className="lab-page workspace-page">
        <div className="workspace-heading flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-normal text-primary">§ 02</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal">Algorithm Simulator</h1>
          </div>
          <p className="hidden font-mono text-xs text-muted-foreground md:block">12 VARIANTEN · STEP-BY-STEP</p>
        </div>
        <Simulator />
      </section>
    </SiteShell>
  );
}
