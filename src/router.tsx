import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Trailing-slash URLs are canonical; static hosts (GitHub Pages) serve
    // prerendered pages as <route>/index.html, which requires this.
    trailingSlash: "always",
    defaultPreloadStaleTime: 0,
  });

  return router;
};
