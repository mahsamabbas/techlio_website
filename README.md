# Techlio website

Marketing site for [Techlio](https://techlio.co), built with [Astro](https://astro.build). All text lives in JSON files under `content/` and can be edited without code through the editor at `/admin`.

```
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run verify   # build, then check links, anchors and contact details on every page
```

## Editing content

| What | File | In the editor |
| --- | --- | --- |
| Contact details, offices, stats, proof, reviews, form endpoint | `content/settings/site.json` | Site settings |
| Home, Process, About, Contact text and FAQs | `content/pages/*.json` | Pages |
| Case studies (add, edit, reorder) | `content/case-studies/*.json` | Case studies |
| Service pages and their home-page cards | `content/services/*.json` | Services |
| Fixed-scope offer pages | `content/offers/*.json` | Fixed-scope offers |

Adding a file to `case-studies`, `services` or `offers` creates its page and adds it to the navigation and listings.

**The `/admin` editor** is [Decap CMS](https://decapcms.org). It saves edits as commits to the `main` branch, and the host rebuilds the site.

- On your computer: run `npm run cms` in one terminal and `npm run dev` in another, then open `http://localhost:4321/admin/`.
- On the live site: Decap needs a GitHub login. Hosting on Netlify provides one (enable the GitHub OAuth provider for the site); other hosts need an OAuth proxy. Editors need write access to this repository.

## Code layout

| Path | What it holds |
| --- | --- |
| `src/pages/` | Routes. `[slug].astro` renders every service and offer; `case-studies/[slug].astro` renders every case study |
| `src/components/`, `src/layouts/` | Shared sections and the page shell |
| `src/lib/content.js` | Loads `content/` |
| `src/styles/main.css` | Design system |
| `public/js/diagrams.js` | Data for the ten interactive diagrams |
| `public/js/pipeline.js` | Diagram renderer |
| `public/admin/` | Editor configuration |

## Before launch

- Set **Form endpoint** in Site settings so the booking form submits directly. Until then it drafts an email to the contact address.
- Add real client reviews in Site settings.
- Confirm each client named in `content/case-studies/` has agreed to be published.
- Terms, privacy and careers links point to the existing techlio.co pages; those pages are not part of this build.
