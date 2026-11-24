# Techlio website

Marketing site for [Techlio](https://techlio.co). Static, zero dependencies: Node 18+ is all you need.

```
npm run build    # src/ -> dist/
npm run dev      # build, then preview at http://localhost:4173
npm run verify   # build + check links, anchors, assets and contact facts on every page
```

Deploy `dist/` to any static host. `netlify.toml` is included.

## Layout

| Path | What it holds |
| --- | --- |
| `src/site.mjs` | Brand facts: contact details, offices, social links, proof numbers, case studies, navigation |
| `src/layout.mjs` | Page shell: head, header, footer, closing call-to-action |
| `src/components.mjs`, `src/templates.mjs` | Shared sections and the service-page template |
| `src/pages/*.mjs` | One file per page |
| `src/assets/js/diagrams.js` | Data for the seven interactive pipeline diagrams |
| `src/assets/js/pipeline.js` | Diagram renderer (SVG, keyboard accessible, vertical layout on phones) |
| `src/assets/css/main.css` | Design system |

## Before launch

- **Form delivery.** `formEndpoint` in `src/site.mjs` is empty, so the booking form drafts an email to contact@techlio.co. Set it to a form backend URL to submit directly.
- **Reviews.** `reviews` in `src/site.mjs` is empty. Add real, attributable client reviews and they render on the home and contact pages.
- **Legal and careers pages** link to the existing techlio.co URLs and are not part of this build.
- **Case studies** contain only what techlio.co publishes today. Add challenge, solution, stack and results per project in `src/site.mjs`.
