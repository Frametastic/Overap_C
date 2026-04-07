# Product Vision & Future Notes

> **IMPORTANT FOR AI ASSISTANTS**: This file is a collection of ideas and notes for the **future production version** of MealOverlap. Do NOT use this file to make changes to the current MVP codebase. These are aspirational notes, not implementation instructions.

> **For humans**: These notes were collected during MVP development whenever ideas about the final product came up. They are organized by topic and meant to inform future planning sessions.

---

## Data Architecture

### Recipe & Ingredient Sourcing
*Discussed: 2026-04-05*

The current MVP uses a manually seeded Supabase database with ~50 recipes. This won't scale for production.

**Recommended approach: Hybrid API + own DB**

| Source | Use for | Notes |
|--------|---------|-------|
| **Spoonacular API** | Recipes, images, ingredients | Best structured data, free tier 150 req/day. Partial German support. |
| **Edamam API** | Alternative recipe source | 10k req/month free. Good nutrition data. |
| **Open Food Facts** | German product data, EAN codes | Open source, useful for future supermarket matching. | 
| **Own Supabase DB** | Cache layer, user-created recipes, overrides | API data gets cached locally, users can add their own. |

**Architecture pattern:**
```
App → Supabase Edge Function (proxy/cache) → External APIs
                                            → Own DB (cache + user data)
```
- Edge Function checks cache first, falls back to API
- Recipes get cached in Supabase after first fetch
- User-created recipes live directly in DB
- Not dependent on a single API — sources can be added/swapped

### Pricing Strategy
*Discussed: 2026-04-05*

Hardcoded prices in the DB will become stale. Options for production:

- **Supermarket APIs (DE)**: REWE/Edeka have no official APIs. Community scraping projects exist but are legally grey.
- **Open Food Facts**: Has some pricing, not comprehensive.
- **Crowdsourcing**: Users enter prices from their local supermarket.
- **Pragmatic approach**: Show prices as estimates ("ca. 3.50€"), never as exact. Update via batch jobs.

### Recipe Images
*Discussed: 2026-04-05*

- **Spoonacular** delivers images with recipes (primary source)
- **Unsplash API** (free) for generic food photos as fallback
- **AI-generated** (DALL-E / Stable Diffusion) for consistent visual style, but has cost implications
- **Long-term**: User-generated content (own photos of cooked meals)

---

## Feature Ideas

### Anchor Recipes / Anchor Ingredients (Core USP)
*Discussed: 2026-04-05*

Users set "anchor" recipes or ingredients during onboarding — dishes/ingredients they love and want to build their week around. These anchors form the **base for the first overlap recommendations**. The overlap algorithm uses anchors as the starting point, suggesting dishes that share ingredients with the user's favorites.

In production, anchors could:
- Be refined over time based on user behavior (which dishes they keep selecting)
- Feed into a personalized recommendation model
- Be visible as a "because you love [Anchor]" explanation on suggested dishes
- Support multiple anchor sets (e.g. "comfort food week" vs "healthy week")

---

## Open Questions

*(Add unresolved questions here)*

- Which API has the best German recipe coverage?
- Legal implications of supermarket price scraping in Germany?
- Should we support multiple languages from the start or German-only first?
