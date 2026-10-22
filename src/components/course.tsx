// Simulator uses dense index math; strict indexed-access checks disabled for this file.
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { Play, Pause, StepForward, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ---------------- Weeks ---------------- */
export const WEEKS: [string, string, string][] = [
  ["14", "Konvexe Hülle", "Konvexe Hülle, Jarvis-Wrap, Local-Repair, Flow und DP Aufgaben"],
  ["13", "Min-Cut & Enclosing Disk", "Min-Cut, Bootstrapping-Algorithmus, Smallest Enclosing Disk, Flow Aufgaben"],
  ["11", "Long Path & Flows", "Long Path Algorithmus, Flows, Maxflow Mincut, Ford-Fulkerson"],
  ["10", "QuickSort & Duplikate", "QuickSort, Duplikate finden mit direktem Sortieren, mit Hashing, mit Hase-Igel Algorithmus"],
  ["09", "Monte-Carlo & Las-Vegas", "Targetshooting, Monte-Carlo und Las-Vegas Algorithmen, Fehlerreduktion, Primzahltests"],
  ["08", "Ungleichungen", "Faltung, Waldsche Identität, Markov, Chebyshev, Chernoff, DP"],
  ["07", "Verteilungen", "Erwartungswert, Varianz, Verteilungen, Unabhängige und bedingte Zufallsvariablen, DP"],
  ["06", "Zufallsvariablen", "Totale Wahrscheinlichkeit, Bayes, Unabhängigkeit, Zufallsvariablen"],
  ["05", "Wahrscheinlichkeit Intro", "Satz von Brooks, Planare Graphen, Wahrscheinlichkeitsraum, Laplace, Kombinatorik, Bedingte Wahrscheinlichkeit"],
  ["04", "Färbungen", "Hopcroft-Karp, Färbungen, Greedy Färbung, Smallest Last Färbung"],
  ["03", "TSP & Matchings", "TSP, TSP Approximationen, Matchings, Augmentierende Pfade, Satz von Berge, Satz von Hall"],
  ["02", "Zusammenhang & Kreise", "Zusammenhang, Artikulationsknoten, Brücken, Tarjan Algorithmus, Euler Tour, Hamiltonkreis, Dirac"],
  ["01", "Einführung in A&W", "Einführung in A&W"],
];

/* ---------------- Simulator types ---------------- */
type Pt = { x: number; y: number };
type Frame = {
  msg: string;
  fill?: Record<number, string>;
  label?: Record<number, string>;
  edge?: Record<string, "active" | "chosen" | "dim" | "cut">;
  elabel?: Record<string, string>;
  circle?: { x: number; y: number; r: number };
  hull?: number[];
  test?: [number, number];
  arr?: { vals: number[]; marks: Record<number, string> };
};
type Scene = { kind: "graph" | "points" | "array"; nodes: Pt[]; edges: [number, number][]; directed?: boolean; frames: Frame[] };

const A = "var(--primary)", R = "var(--viz-2)", G = "var(--viz-3)", Y = "var(--viz-4)", D = "var(--foreground)";
const PAL = [A, R, G, Y];
const ek = (a: number, b: number, dir = false) => (dir || a < b ? `${a}-${b}` : `${b}-${a}`);
const rnd = (n: number) => Math.floor(Math.random() * n);

const N1: Pt[] = [
  { x: 80, y: 200 }, { x: 180, y: 90 }, { x: 180, y: 310 }, { x: 300, y: 200 },
  { x: 420, y: 90 }, { x: 420, y: 310 }, { x: 520, y: 200 }, { x: 300, y: 50 },
];
const E1: [number, number][] = [[0,1],[0,2],[1,2],[1,3],[2,3],[3,4],[3,5],[4,5],[4,6],[5,6],[1,7]];
const N2 = N1.slice(0, 7);
const E2: [number, number][] = [[0,1],[0,2],[1,2],[1,3],[2,3],[3,4],[3,5],[4,5],[4,6],[5,6],[2,5]];
const adj = (n: number, E: [number, number][]) => {
  const a: number[][] = Array.from({ length: n }, () => []);
  E.forEach(([u, v]) => { a[u].push(v); a[v].push(u); });
  return a;
};
const randPts = (n: number) => Array.from({ length: n }, () => ({ x: 60 + Math.random() * 480, y: 50 + Math.random() * 300 }));
const dist = (p: Pt, q: Pt) => Math.hypot(p.x - q.x, p.y - q.y);

function tarjan(): Scene {
  const ad = adj(8, E1), disc: number[] = Array(8).fill(-1), low: number[] = Array(8).fill(0);
  const frames: Frame[] = []; let t = 0; const tree: Record<string, "chosen"> = {};
  const lab = () => Object.fromEntries(disc.map((d, i) => [i, d < 0 ? "" : `${d}/${low[i]}`]).filter(([, s]) => s));
  const fill = () => Object.fromEntries(disc.map((d, i) => [i, d < 0 ? "" : A]).filter(([, s]) => s));
  const art = new Set<number>(), bridges: string[] = [];
  const dfs = (u: number, p: number) => {
    disc[u] = low[u] = t++; let ch = 0;
    frames.push({ msg: `Besuche ${u}: dfs=${disc[u]}`, fill: { ...fill(), [u]: R }, label: lab(), edge: { ...tree } });
    for (const v of ad[u]) {
      if (v === p) continue;
      if (disc[v] < 0) {
        tree[ek(u, v)] = "chosen"; ch++; dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (p >= 0 && low[v] >= disc[u]) art.add(u);
        if (low[v] > disc[u]) bridges.push(ek(u, v));
        frames.push({ msg: `Zurück zu ${u}: low=${low[u]}`, fill: { ...fill(), [u]: R }, label: lab(), edge: { ...tree } });
      } else {
        low[u] = Math.min(low[u], disc[v]);
        frames.push({ msg: `Rückwärtskante ${u}–${v}: low[${u}]=${low[u]}`, fill: { ...fill(), [u]: R }, label: lab(), edge: { ...tree, [ek(u, v)]: "active" } });
      }
    }
    if (p < 0 && ch > 1) art.add(u);
  };
  dfs(0, -1);
  const f = fill(); art.forEach((a) => (f[a] = R));
  const e: Frame["edge"] = { ...tree }; bridges.forEach((b) => (e![b] = "cut"));
  frames.push({ msg: `Artikulationsknoten: {${[...art].join(", ")}} · Brücken: ${bridges.join(", ")}`, fill: f, label: lab(), edge: e });
  return { kind: "graph", nodes: N1, edges: E1, frames };
}

function euler(): Scene {
  const E: [number, number][] = [...E2, [1, 4]];
  const used = new Set<number>(), ad = adj(7, E).map((l, u) => l.map((v) => [v, E.findIndex(([a, b]) => (a === u && b === v) || (a === v && b === u))]));
  const frames: Frame[] = []; const st = [0], tour: number[] = []; const done: Record<string, "chosen"> = {};
  while (st.length) {
    const u = st[st.length - 1]; const nx = ad[u].find(([, i]) => !used.has(i));
    if (nx) { used.add(nx[1]); st.push(nx[0]); done[ek(u, nx[0])] = "chosen";
      frames.push({ msg: `Laufe ${u} → ${nx[0]} (Stack: ${st.join(" ")})`, fill: { [nx[0]]: R }, edge: { ...done } });
    } else { tour.push(st.pop()!); frames.push({ msg: `Sackgasse, füge ${u} zur Tour hinzu: ${tour.join(" ")}`, fill: { [u]: A }, edge: { ...done } }); }
  }
  frames.push({ msg: `Eulertour: ${tour.reverse().join(" → ")}`, edge: { ...done } });
  return { kind: "graph", nodes: N2, edges: E, frames };
}

function hamilton(): Scene {
  const ad = adj(7, E2), frames: Frame[] = []; const path = [0]; const vis = new Set([0]); let found = false;
  const snap = (msg: string, extra?: string) => {
    const edge: Frame["edge"] = {}; for (let i = 1; i < path.length; i++) edge[ek(path[i - 1], path[i])] = "chosen";
    if (extra) edge[extra] = "chosen";
    frames.push({ msg, fill: Object.fromEntries(path.map((p, i) => [p, i === path.length - 1 ? R : A])), edge });
  };
  const bt = (u: number) => {
    if (found) return;
    if (path.length === 7) { if (ad[u].includes(0)) { found = true; snap(`Hamiltonkreis gefunden: ${path.join(" → ")} → 0`, ek(u, 0)); } else snap(`Kein Rückweg von ${u} nach 0 — Backtrack`); return; }
    for (const v of ad[u]) if (!vis.has(v) && !found) { vis.add(v); path.push(v); snap(`Pfad: ${path.join(" → ")}`); bt(v); if (found) return; path.pop(); vis.delete(v); snap(`Backtrack zu ${u}`); }
  };
  snap("Start bei 0"); bt(0);
  return { kind: "graph", nodes: N2, edges: E2, frames };
}

function tsp(): Scene {
  const P = randPts(8), n = P.length, inT = new Set([0]), frames: Frame[] = [], mst: [number, number][] = [];
  const edge: Frame["edge"] = {};
  while (inT.size < n) {
    let best: [number, number] = [0, 0], bd = Infinity;
    inT.forEach((u) => P.forEach((_, v) => { if (!inT.has(v) && dist(P[u], P[v]) < bd) { bd = dist(P[u], P[v]); best = [u, v]; } }));
    inT.add(best[1]); mst.push(best); edge[ek(...best)] = "active";
    frames.push({ msg: `MST (Prim): füge Kante ${best[0]}–${best[1]} hinzu`, edge: { ...edge }, fill: Object.fromEntries([...inT].map((i) => [i, A])) });
  }
  const ad = adj(n, mst), order: number[] = [], vis = new Set<number>();
  const dfs = (u: number) => { vis.add(u); order.push(u); ad[u].forEach((v) => !vis.has(v) && dfs(v)); };
  dfs(0); order.push(0);
  const tour: Frame["edge"] = {};
  Object.keys(edge).forEach((k) => (tour[k] = "dim"));
  for (let i = 1; i < order.length; i++) {
    tour[ek(order[i - 1], order[i])] = "chosen";
    frames.push({ msg: `Shortcut-Tour (2-Approx.): ${order.slice(0, i + 1).join(" → ")}`, edge: { ...tour }, fill: { [order[i]]: R } });
  }
  const E: [number, number][] = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) E.push([i, j]);
  const len = order.slice(1).reduce((s, v, i) => s + dist(P[order[i]], P[v]), 0);
  frames.push({ msg: `Tourlänge ${len.toFixed(0)} ≤ 2 · MST`, edge: Object.fromEntries(Object.entries(tour).filter(([, s]) => s === "chosen")) });
  return { kind: "graph", nodes: P, edges: E, frames: frames.map((f) => ({ ...f, edge: { ...Object.fromEntries(E.map(([a, b]) => [ek(a, b), "dim" as const])), ...f.edge } })) };
}

function matching(): Scene {
  const E = [...E2].sort(() => Math.random() - 0.5), M = new Set<number>(), edge: Frame["edge"] = {}, frames: Frame[] = [];
  E.forEach(([u, v]) => {
    if (!M.has(u) && !M.has(v)) { M.add(u); M.add(v); edge[ek(u, v)] = "chosen"; frames.push({ msg: `Nimm ${u}–${v} ins Matching`, edge: { ...edge }, fill: Object.fromEntries([...M].map((m) => [m, A])) }); }
    else frames.push({ msg: `${u}–${v} blockiert`, edge: { ...edge, [ek(u, v)]: "cut" }, fill: Object.fromEntries([...M].map((m) => [m, A])) });
  });
  frames.push({ msg: `Inklusionsmaximales Matching, |M| = ${M.size / 2} (≥ ½ · Maximum)`, edge, fill: Object.fromEntries([...M].map((m) => [m, A])) });
  return { kind: "graph", nodes: N2, edges: E2, frames };
}

function coloring(): Scene {
  const ad = adj(7, E2), col: number[] = Array(7).fill(-1), frames: Frame[] = [];
  const order = [...Array(7).keys()].sort(() => Math.random() - 0.5);
  order.forEach((u) => {
    const taken = new Set(ad[u].map((v) => col[v])); let c = 0; while (taken.has(c)) c++; col[u] = c;
    frames.push({ msg: `Greedy: Knoten ${u} erhält Farbe ${c + 1}`, fill: Object.fromEntries(col.map((c, i) => [i, c < 0 ? "" : PAL[c % 4]]).filter(([, s]) => s)), label: { [u]: `c${c + 1}` } });
  });
  frames.push({ msg: `Fertig: ${Math.max(...col) + 1} Farben ≤ Δ+1 = ${Math.max(...ad.map((a) => a.length)) + 1}`, fill: Object.fromEntries(col.map((c, i) => [i, PAL[c % 4]])) });
  return { kind: "graph", nodes: N2, edges: E2, frames };
}

function duplicates(): Scene {
  const n = 9, vals = Array.from({ length: n + 1 }, () => 1 + rnd(n)); const f = (i: number) => vals[i];
  const frames: Frame[] = []; let t = f(0), h = f(f(0));
  const mk = (msg: string, extra: Record<number, string> = {}) => frames.push({ msg, arr: { vals, marks: { ...extra, [t]: (extra[t] ? extra[t] + " " : "") + "🐢", [h]: (h === t ? "🐢🐇" : "🐇") } } });
  mk("Start: Igel (🐢) 1 Schritt, Hase (🐇) 2 Schritte, Graph i → a[i]");
  while (t !== h) { t = f(t); h = f(f(h)); mk(`Phase 1: 🐢=${t}, 🐇=${h}`); }
  t = 0; mk("Treffpunkt gefunden. 🐢 zurück auf 0");
  while (t !== h) { t = f(t); h = f(h); mk(`Phase 2: beide 1 Schritt: 🐢=${t}, 🐇=${h}`); }
  frames.push({ msg: `Duplikat gefunden: Wert ${t}`, arr: { vals, marks: Object.fromEntries(vals.map((v, i) => [i, v === t ? "DUP" : ""]).filter(([, s]) => s)) } });
  return { kind: "array", nodes: [], edges: [], frames };
}

function longPath(): Scene {
  const ad = adj(8, E1), k = 4, frames: Frame[] = [];
  for (let trial = 1; trial <= 12; trial++) {
    const c = Array.from({ length: 8 }, () => rnd(k));
    const fill = Object.fromEntries(c.map((x, i) => [i, PAL[x]]));
    let found: number[] | null = null;
    const dfs = (p: number[], used: Set<number>) => {
      if (found) return; if (p.length === k) { found = [...p]; return; }
      for (const v of ad[p[p.length - 1]]) if (!p.includes(v) && !used.has(c[v])) { used.add(c[v]); p.push(v); dfs(p, used); p.pop(); used.delete(c[v]); }
    };
    for (let s = 0; s < 8 && !found; s++) dfs([s], new Set([c[s]]));
    if (found) {
      const f = found as number[]; const edge: Frame["edge"] = {};
      for (let i = 1; i < f.length; i++) edge[ek(f[i - 1], f[i])] = "chosen";
      frames.push({ msg: `Versuch ${trial}: bunter Pfad der Länge ${k - 1} gefunden: ${f.join(" → ")}`, fill, edge, label: Object.fromEntries(f.map((v) => [v, "✓"])) });
      break;
    }
    frames.push({ msg: `Versuch ${trial}: zufällige ${k}-Färbung, kein bunter Pfad — neu färben`, fill });
  }
  return { kind: "graph", nodes: N1, edges: E1, frames };
}

function maxflow(): Scene {
  const nodes: Pt[] = [{ x: 70, y: 200 }, { x: 220, y: 90 }, { x: 220, y: 310 }, { x: 390, y: 90 }, { x: 390, y: 310 }, { x: 530, y: 200 }];
  const E: [number, number, number][] = [[0,1,10],[0,2,8],[1,2,3],[1,3,6],[2,4,9],[3,4,2],[3,5,7],[4,5,10],[1,4,4]];
  const flow = E.map(() => 0), frames: Frame[] = [];
  const lbl = () => Object.fromEntries(E.map(([a, b, c], i) => [ek(a, b, true), `${flow[i]}/${c}`]));
  let total = 0;
  frames.push({ msg: "Ford-Fulkerson (BFS / Edmonds-Karp): s = 0, t = 5", elabel: lbl(), fill: { 0: A, 5: R } });
  for (;;) {
    const prev: ([number, number, number] | null)[] = Array(6).fill(null); const q = [0]; const seen = new Set([0]);
    while (q.length) { const u = q.shift()!; E.forEach(([a, b, c], i) => {
      if (a === u && !seen.has(b) && flow[i] < c) { seen.add(b); prev[b] = [a, i, 1]; q.push(b); }
      if (b === u && !seen.has(a) && flow[i] > 0) { seen.add(a); prev[a] = [b, i, -1]; q.push(a); }
    }); }
    if (!seen.has(5)) {
      const cut: Frame["edge"] = {}; E.forEach(([a, b], i) => { if (seen.has(a) && !seen.has(b)) cut[ek(a, b, true)] = "cut"; void i; });
      frames.push({ msg: `Kein augmentierender Pfad. Maxflow = ${total} = Kapazität des Min-Cuts`, elabel: lbl(), edge: cut, fill: Object.fromEntries([...seen].map((s) => [s, A])) });
      break;
    }
    let b = Infinity, v = 5; const path: number[] = [5];
    while (v !== 0) { const [u, i, d] = prev[v]!; b = Math.min(b, d > 0 ? E[i][2] - flow[i] : flow[i]); v = u; path.push(u); }
    v = 5; const edge: Frame["edge"] = {};
    while (v !== 0) { const [u, i, d] = prev[v]!; flow[i] += d * b; edge[ek(E[i][0], E[i][1], true)] = "active"; v = u; }
    total += b;
    frames.push({ msg: `Augmentiere ${path.reverse().join(" → ")} um ${b} · Fluss = ${total}`, elabel: lbl(), edge, fill: Object.fromEntries(path.map((p) => [p, R])) });
  }
  return { kind: "graph", nodes, edges: E.map(([a, b]) => [a, b]), directed: true, frames };
}

function mincut(): Scene {
  const grp = [...Array(8).keys()], frames: Frame[] = [];
  const find = (x: number): number => (grp[x] === x ? x : (grp[x] = find(grp[x])));
  const state = () => {
    const roots = [...new Set(grp.map((_, i) => find(i)))];
    const fill = Object.fromEntries(grp.map((_, i) => [i, PAL[roots.indexOf(find(i)) % 4]]));
    const edge: Frame["edge"] = {}; E1.forEach(([a, b]) => { if (find(a) === find(b)) edge[ek(a, b)] = "dim"; });
    return { fill, edge, roots };
  };
  let comps = 8;
  frames.push({ msg: "Karger: kontrahiere zufällige Kanten bis 2 Superknoten bleiben", ...state() });
  while (comps > 2) {
    const alive = E1.filter(([a, b]) => find(a) !== find(b)); const [a, b] = alive[rnd(alive.length)];
    grp[find(a)] = find(b); comps--;
    const s = state(); frames.push({ msg: `Kontrahiere ${a}–${b} · ${comps} Superknoten`, fill: s.fill, edge: { ...s.edge, [ek(a, b)]: "active" } });
  }
  const s = state(); const cut = E1.filter(([a, b]) => find(a) !== find(b));
  cut.forEach(([a, b]) => (s.edge[ek(a, b)] = "cut"));
  frames.push({ msg: `Schnitt der Grösse ${cut.length} (Erfolgsw'keit ≥ 2/(n(n−1)) — wiederholen!)`, fill: s.fill, edge: s.edge });
  return { kind: "graph", nodes: N1, edges: E1, frames };
}

function circ3(a: Pt, b: Pt, c: Pt) {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)); if (Math.abs(d) < 1e-9) return null;
  const A2 = a.x ** 2 + a.y ** 2, B2 = b.x ** 2 + b.y ** 2, C2 = c.x ** 2 + c.y ** 2;
  const x = (A2 * (b.y - c.y) + B2 * (c.y - a.y) + C2 * (a.y - b.y)) / d, y = (A2 * (c.x - b.x) + B2 * (a.x - c.x) + C2 * (b.x - a.x)) / d;
  return { x, y, r: Math.hypot(a.x - x, a.y - y) };
}
function minDisk(P: Pt[]) {
  const inside = (c: { x: number; y: number; r: number }) => P.every((p) => dist(p, c) <= c.r + 1e-6);
  let best = { x: P[0].x, y: P[0].y, r: 0 }; if (P.length === 1) return best; best.r = Infinity;
  for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
    const c = { x: (P[i].x + P[j].x) / 2, y: (P[i].y + P[j].y) / 2, r: dist(P[i], P[j]) / 2 };
    if (c.r < best.r && inside(c)) best = c;
    for (let k = j + 1; k < P.length; k++) { const c3 = circ3(P[i], P[j], P[k]); if (c3 && c3.r < best.r && inside(c3)) best = c3; }
  }
  return best;
}
function disk(): Scene {
  const P = randPts(12).map((p) => ({ x: 150 + (p.x - 60) * 0.6, y: 80 + (p.y - 50) * 0.8 })), frames: Frame[] = [];
  let c = { x: P[0].x, y: P[0].y, r: 0 };
  for (let i = 1; i < P.length; i++) {
    const out = dist(P[i], c) > c.r + 1e-6;
    frames.push({ msg: `Punkt ${i} ${out ? "liegt AUSSERHALB → Disk neu berechnen" : "liegt innerhalb"}`, circle: c, fill: { ...Object.fromEntries(P.slice(0, i).map((_, j) => [j, A])), [i]: R } });
    if (out) { c = minDisk(P.slice(0, i + 1)); frames.push({ msg: `Neue kleinste Disk, r = ${c.r.toFixed(1)}`, circle: c, fill: Object.fromEntries(P.slice(0, i + 1).map((_, j) => [j, A])) }); }
  }
  frames.push({ msg: `Smallest Enclosing Disk, r = ${c.r.toFixed(1)}`, circle: c, fill: Object.fromEntries(P.map((_, j) => [j, A])) });
  return { kind: "points", nodes: P, edges: [], frames };
}

function hull(): Scene {
  const P = randPts(14), frames: Frame[] = [];
  const cross = (o: Pt, a: Pt, b: Pt) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const start = P.reduce((m, p, i) => (p.x < P[m].x ? i : m), 0); const H = [start]; let cur = start;
  for (let guard = 0; guard < 20; guard++) {
    let cand = (cur + 1) % P.length;
    for (let i = 0; i < P.length; i++) {
      if (i === cur) continue;
      frames.push({ msg: `Jarvis-Wrap: von ${cur} — teste ${i} gegen Kandidat ${cand}`, hull: [...H], test: [cur, i], fill: { [cand]: R, [cur]: A } });
      if (cross(P[cur], P[cand], P[i]) < 0) cand = i;
    }
    if (cand === start) break; H.push(cand); cur = cand;
  }
  frames.push({ msg: `Konvexe Hülle mit ${H.length} Ecken (O(n·h))`, hull: [...H, start], fill: Object.fromEntries(H.map((h) => [h, A])) });
  return { kind: "points", nodes: P, edges: [], frames };
}

const ALGOS: [string, () => Scene][] = [
  ["Tarjan", tarjan], ["Euler Tour", euler], ["Hamilton Cycle", hamilton], ["Metric TSP", tsp],
  ["Matchings", matching], ["Colorings", coloring], ["Duplicates", duplicates], ["Long Path", longPath],
  ["Max Flow", maxflow], ["Minimum Edge Cut", mincut], ["Smallest Enclosing Disk", disk], ["Convex Hull", hull],
];

/* ---------------- Canvas ---------------- */
function Canvas({ scene, frame }: { scene: Scene; frame: Frame }) {
  if (scene.kind === "array" && frame.arr) {
    const { vals, marks } = frame.arr;
    return (
      <div className="flex h-full flex-wrap content-center justify-center gap-0 p-8">
        {vals.map((v, i) => (
          <div key={i} className={`w-14 border-y border-l border-foreground/20 last:border-r font-mono text-center ${marks[i] ? "bg-accent" : ""}`}>
            <div className="border-b border-foreground/10 py-1 text-[10px] text-muted-foreground">{i}</div>
            <div className={`py-3 text-lg ${marks[i] === "DUP" ? "text-primary font-bold" : ""}`}>{v}</div>
            <div className="h-6 text-sm">{marks[i] !== "DUP" ? marks[i] : ""}</div>
          </div>
        ))}
      </div>
    );
  }
  const N = scene.nodes; const pts = scene.kind === "points";
  return (
    <svg viewBox="0 0 600 400" className="h-full w-full">
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--muted-foreground)" />
        </marker>
      </defs>
      {frame.circle && <circle cx={frame.circle.x} cy={frame.circle.y} r={frame.circle.r} fill="var(--accent)" stroke={A} strokeWidth={1.5} />}
      {frame.hull && frame.hull.length > 1 && <polyline points={frame.hull.map((i) => `${N[i].x},${N[i].y}`).join(" ")} fill="none" stroke={A} strokeWidth={2} />}
      {frame.test && <line x1={N[frame.test[0]].x} y1={N[frame.test[0]].y} x2={N[frame.test[1]].x} y2={N[frame.test[1]].y} stroke={R} strokeDasharray="4 4" />}
      {scene.edges.map(([a, b]) => {
        const k = ek(a, b, scene.directed); const s = frame.edge?.[k];
        const stroke = s === "chosen" ? A : s === "active" ? R : s === "cut" ? R : "var(--muted-foreground)";
        const op = s === "dim" ? 0.12 : s ? 1 : 0.45;
        const mx = (N[a].x + N[b].x) / 2, my = (N[a].y + N[b].y) / 2;
        return (
          <g key={k}>
            <line x1={N[a].x} y1={N[a].y} x2={N[b].x} y2={N[b].y} stroke={stroke} strokeOpacity={op} strokeWidth={s && s !== "dim" ? 3 : 1.25}
              strokeDasharray={s === "cut" ? "6 4" : undefined} markerEnd={scene.directed ? "url(#arr)" : undefined} />
            {frame.elabel?.[k] && (<g><rect x={mx - 18} y={my - 9} width={36} height={18} fill="var(--canvas)" stroke="var(--border)" />
              <text x={mx} y={my + 4} textAnchor="middle" fontSize={11} className="font-mono" fill={D}>{frame.elabel[k]}</text></g>)}
          </g>
        );
      })}
      {N.map((p, i) => {
        const f = frame.fill?.[i];
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={pts ? 5 : 15} fill={f || "var(--canvas)"} stroke={f || D} strokeWidth={1.5} />
            {!pts && <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={12} className="font-mono" fill={f ? "var(--primary-foreground)" : D}>{i}</text>}
            {frame.label?.[i] && <text x={p.x} y={p.y - (pts ? 10 : 22)} textAnchor="middle" fontSize={11} className="font-mono" fill={A}>{frame.label[i]}</text>}
          </g>
        );
      })}
    </svg>
  );
}

export function Simulator() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <SimulatorInner /> : <div className="simulator-loading border-t border-foreground" />;
}

function SimulatorInner() {
  const [algo, setAlgo] = useState(11);
  const [seed, setSeed] = useState(0);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const scene = useMemo(() => ALGOS[algo][1](), [algo, seed]); // eslint-disable-line react-hooks/exhaustive-deps
  const last = scene.frames.length - 1;
  useEffect(() => { setI(0); setPlaying(false); }, [algo, seed]);
  useEffect(() => {
    if (!playing) return;
    if (i >= last) { setPlaying(false); return; }
    const t = setTimeout(() => setI((x) => x + 1), 1100 / speed);
    return () => clearTimeout(t);
  }, [playing, i, last, speed]);
  const frame = scene.frames[Math.min(i, last)];
  return (
    <div className="simulator-grid">
      <ol className="algorithm-list" aria-label="Algorithmen">
        {ALGOS.map(([name], k) => (
          <li key={name}>
            <Button variant="ghost" onClick={() => { setPlaying(false); setI(0); setAlgo(k); }}
              aria-pressed={k === algo}
              className={`algorithm-choice ${k === algo ? "bg-accent text-primary" : "text-foreground"}`}>
              <span className="text-[10px] text-muted-foreground">{String(k + 1).padStart(2, "0")}</span>
              <span>{name}</span>
            </Button>
          </li>
        ))}
      </ol>
      <div className="simulation-stage">
        <div className="simulation-title flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 className="text-xl font-bold">{ALGOS[algo][0]}</h2>
          <span aria-label="Fortschritt" className="shrink-0 font-mono text-[11px] text-muted-foreground">STEP {String(Math.min(i, last) + 1).padStart(3, "0")} / {String(last + 1).padStart(3, "0")}</span>
        </div>
        <div className="simulation-canvas bg-canvas"><Canvas scene={scene} frame={frame} /></div>
        <p className="simulation-message border-y border-border px-4 py-3 font-mono text-xs">
          <span className="mr-3 text-primary">▸</span>{frame.msg}
        </p>
        <div className="simulation-controls flex flex-wrap items-center gap-2 px-4 py-3">
          <Button variant="outline" size="sm" onClick={() => (i >= last ? (setI(0), setPlaying(true)) : setPlaying((p) => !p))}>
            {playing ? <Pause /> : <Play />}{playing ? "Pause" : "Play"}
          </Button>
          <Button variant="outline" size="sm" disabled={i >= last} onClick={() => { setPlaying(false); setI((x) => Math.min(last, x + 1)); }}><StepForward />Step</Button>
          <Button variant="outline" size="sm" onClick={() => { setPlaying(false); setI(0); setSeed((s) => s + 1); }}><RotateCcw />Reset</Button>
          <label className="ml-auto flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            Speed <input aria-label="Speed" type="range" min={1} max={10} value={speed} onChange={(e) => setSpeed(+e.target.value)} className="w-20 accent-primary" />
            <span className="w-6 text-foreground">{speed}×</span>
          </label>
        </div>
      </div>
    </div>
  );
}
