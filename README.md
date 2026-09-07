# QuartzMat Code Rebuild

Modern React/Vite rebuild of the QuartzMat website.

## Current status

- React/Vite storefront structure
- Product catalog and cart UI
- Real QuartzMat product imagery selected from Drive and integrated into the relevant product cards
- Real QuartzMat brand mark integrated into the header/footer and favicon
- Flow environment variables reserved via `.env.example`

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Assets

Production-facing images live in `public/images/`. Only approved/relevant QuartzMat assets are committed; source Drive folders may contain drafts, duplicates, editing versions, or legacy material that should not be published.

## Payments

Flow credentials must be provided as environment variables in the deployment platform. Never commit API keys or secrets to GitHub.
