import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-nav";
import { Simulator } from "@/components/course";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Algorithm Lab — A&P // ETH Zürich" },
      { name: "description", content: "Interaktiver Simulator für 12 Algorithmen: Tarjan, Euler Tour, Max Flow, Min-Cut, Convex Hull und mehr." },
      { property: "og:title", content: "Algorithm Lab — A&P // ETH Zürich" },
      { property: "og:description", content: "12 Algorithmen Schritt für Schritt visualisiert." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Lab,
});

function Lab() {
  return (
    <SiteShell>
      <section className="py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary">§ 02</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">Algorithm Lab</h1>
          </div>
          <p className="hidden font-mono text-xs text-muted-foreground md:block">12 VARIANTEN · STEP-BY-STEP</p>
        </div>
        <Simulator />
      </section>
    </SiteShell>
  );
}
