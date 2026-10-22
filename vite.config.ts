// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// GitHub Pages hosts the site under /a-w-ju/ (repository a-w-ju). The base is
// applied to production builds outside the Lovable sandbox only, so the dev
// preview keeps serving at "/" and a Lovable publish is unaffected.
export default defineConfig((env) => ({
  vite:
    env.command === "build" && !process.env.LOVABLE_SANDBOX
      ? { base: "/a-w-ju/" }
      : {},
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Render every route to static HTML at build time so the static host
    // (GitHub Pages) serves each page directly. Trailing slashes match the
    // router's trailingSlash: "always" setting in src/router.tsx.
    prerender: { enabled: true },
    pages: [{ path: "/" }, { path: "/materials/" }, { path: "/lab/" }],
  },
}));
