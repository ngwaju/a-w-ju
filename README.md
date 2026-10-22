# Algorithm Atlas Weekly Compass

Erstelle mir eine moderne, hoch-minimalistische TA-Webseite für das Fach "Algorithms & Probability" im Schweizer Typografie-Stil (Swiss / Editorial Design). Das Design soll sich optisch komplett von typischen bunten Card-Layouts oder dunklen Kachel-Grids unterscheiden.

1. Design & Ästhetik:

Look & Feel: Sehr viel Weißraum, klare 1px-Trennlinien (border-gray-200), flache Strukturen und typografischer Fokus.

Farben: Off-White Hintergrund (#F9F9FB), dunkler Text (#111827), ergänzt durch genau eine prägnante Akzentfarbe (z. B. Kobaltblau #0047AB oder Signalrot #E63946).

Typografie: Große, prägnante Headlines (Sans-Serif) kombiniert mit einer sauberen Monospace-Schriftart (z. B. JetBrains Mono) für Wochennummern, Metadaten und Algorithmen-Varianten.

2. Header & Metadaten:

Ein minimalistischer Top-Bar im Stile einer Magazin-Kopfzeile:

Titel: "A&W // ETH ZÜRICH"

Info-Badges: "Thu 16:15" | "HG " | "SPRACHE: GERMAN"

3. Hauptbereich – Kursinhalte (Wochenübersicht):

Statt bunter Karten eine vertikale, strukturierte Accordion-Liste mit feinen Trennlinien. Jede Woche lässt sich aufklappen oder zeigt direkt ihre Details:

WEEK 14 – Konvexe Hülle: Konvexe Hülle, Jarvis-Wrap, Local-Repair, Flow und DP Aufgaben

WEEK 13 – Min-Cut & Enclosing Disk: Min-Cut, Bootstrapping-Algorithmus, Smallest Enclosing Disk, Flow Aufgaben

WEEK 11 – Long Path & Flows: Long Path Algorithmus, Flows, Maxflow Mincut, Ford-Fulkerson

WEEK 10 – QuickSort & Duplikate: QuickSort, Duplikate finden mit direktem Sortieren, mit Hashing, mit Hase-Igel Algorithmus

WEEK 09 – Monte-Carlo & Las-Vegas: Targetshooting, Monte-Carlo und Las-Vegas Algorithmen, Fehlerreduktion, Primzahltests

WEEK 08 – Ungleichungen: Faltung, Waldsche Identität, Markov, Chebyshev, Chernoff, DP

WEEK 07 – Verteilungen: Erwartungswert, Varianz, Verteilungen, Unabhängige und bedingte Zufallsvariablen, DP

WEEK 06 – Zufallsvariablen: Totale Wahrscheinlichkeit, Bayes, Unabhängigkeit, Zufallsvariablen

WEEK 05 – Wahrscheinlichkeit Intro: Satz von Brooks, Planare Graphen, Wahrscheinlichkeitsraum, Laplace, Kombinatorik, Bedingte Wahrscheinlichkeit

WEEK 04 – Färbungen: Hopcroft-Karp, Färbungen, Greedy Färbung, Smallest Last Färbung

WEEK 03 – TSP & Matchings: TSP, TSP Approximationen, Matchings, Augmentierende Pfade, Satz von Berge, Satz von Hall

WEEK 02 – Zusammenhang & Kreise: Zusammenhang, Artikulationsknoten, Brücken, Tarjan Algorithmus, Euler Tour, Hamiltonkreis, Dirac
week introduction in algorithen und wahrscheinlichekeiten

4. Algorithm Simulator (Simulator-Bereich):

Linke Seite (Algorithmen-Auswahl): Eine vertikale Monospace-Liste aller 12 Algorithmen:

Tarjan

Euler Tour

Hamilton Cycle

Metric TSP

Matchings

Colorings

Duplicates

Long Path

Max Flow

Minimum Edge Cut

Smallest Enclosing Disk

Convex Hull

Rechte Seite (Interaktiver Canvas/Simulation):

Klickt der Nutzer links auf einen Algorithmus (z. B. Convex Hull oder Tarjan), lädt rechts sofort das interaktive Visualisierungscarvas.

Das Canvas läuft auf hellem oder tiefgrauem Grund mit klaren Kontrollen (Play, Step, Reset, Speed).

Erstelle den vollständigen React-Code inklusive Tailwind CSS als eine lauffähige Single-File-Komponente.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/40879844-ecd8-5d3b-98be-fc176f5b92e9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
