# RAIZ Visibility — website

Astro site built from the Claude Design handoff (`RAIZ Visibility design system`). It deploys to GitHub Pages on every push to `main`.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
```

## How it's put together

| Path | What's there |
| --- | --- |
| `src/styles/tokens/` | Design tokens, copied verbatim from the design system |
| `src/styles/global.css` | Base styles, responsive switch, blog article typography |
| `src/styles/interactions.css` | Hover and `::before` rules generated from the design's `style-hover` / `style-before` |
| `src/components/design/` | Page bodies, one desktop and one mobile file per page, with the design's exact inline styles |
| `src/components/` | Header, footer, `ImageSlot` |
| `src/content/services/` | One Markdown file per service page, rendered by the service template |
| `src/content/blog/` | Blog posts in Markdown |
| `src/data/site.ts` | Service menu, industries, authors |
| `tools/convert.mjs` | The one-time converter from the design's `.dc.html` files (keep it for reference only; re-running it overwrites the hand edits) |

**Desktop and mobile.** The design draws every page twice: a 1440px desktop version and a 390px mobile version. The site renders both and switches between them at 1024px.
- **1024–1439px:** the desktop version scales down proportionally.
- **Wider than 1440px:** it stays at 1440, and the section backgrounds stretch to the edges of the screen.

## Everyday edits

- **Images:** every grey placeholder is an `ImageSlot` with an id. Put a file named after that id in `public/images/` and it shows up automatically, e.g. `public/images/raiz-founder-1.jpg` (Ryan's portrait). The ids in use are:
  - Founders: `raiz-founder-1`, `raiz-founder-2`
  - Home evidence scans: `evidence-1-before`, `evidence-1-after`, `evidence-2-before`, `evidence-2-after`
  - Service pages: `local-seo-before`, `local-seo-after`
  - Blog posts: `blog-<post-file-name>`
- **New blog post:** add a `.md` file to `src/content/blog/` and copy the frontmatter from an existing post.
- **New service page:** copy `src/content/services/local-seo.md` to `<slug>.md` and rewrite the copy. It's served at `/services/<slug>/`.
- **Contact form:** set a repository variable `PUBLIC_FORM_ENDPOINT` (Settings → Secrets and variables → Actions → Variables) to a Formspree-style endpoint, e.g. `https://formspree.io/f/xxxxxxx`. Until then, the form opens the visitor's email app addressed to hello@raizvisibility.com.

## Deploying

The workflow is `.github/workflows/deploy.yml`. In the GitHub repo, go to Settings → Pages → Source and choose **GitHub Actions**. The workflow works out the site URL and sub-path by itself. A custom domain set in the Pages settings works with no code changes.
