<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->


## Workspace structure
- Keep homepage, materials and simulator as separate TanStack leaf routes; preserve their URLs to support navigation and direct entry.
- Use shared screen-height workspace classes with flexible canvas space on desktop and natural scrolling on mobile, so controls and all course weeks remain visible.
- Week previews share one fixed-height detail region; pointer preview and persistent keyboard/click selection use the same supplied course data.
