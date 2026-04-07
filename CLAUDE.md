# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MealOverlap** is a meal planning app whose core idea is **overlapping ingredients** across dishes to reduce food waste and shopping costs. The project follows an iterative MVP approach. Language context: the product spec and user-facing content are in German.

**Current status: Phase 1 (MVP) — scaffolding complete, DB schema + seed data deployed.**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript |
| Styling | Tailwind CSS |
| State | Zustand or React Context |
| Backend | Supabase (Auth, DB, API) |
| Database | PostgreSQL (via Supabase) |
| Deployment | Vercel |

## Core Algorithm: Ingredient Overlap

The central mechanic uses **Jaccard similarity** to score ingredient overlap between dishes:

```
overlap_score(A, B) = |ingredients(A) ∩ ingredients(B)| / |ingredients(A) ∪ ingredients(B)|
```

A slider controls the balance between variety and cost savings:
- `final_score = α × overlap_score + (1-α) × variety_score`
- α = 0.0 → maximize variety, α = 1.0 → maximize overlap/savings

## Data Model

- **User** → profile (name, email, location, intolerances, preference α), meal plans (1:n)
- **Gericht (Dish)** → ingredients (m2m with quantity + unit), category (breakfast/lunch/dinner/snack)
- **Zutat (Ingredient)** → name, unit, category
- **Wochenplan (Meal Plan)** → week date, entries (dish + weekday + meal slot)
- **Einkaufsliste (Shopping List)** → auto-aggregated from meal plan

## App Concept & User Flow

### Core Experience: Dish Selection & Overlap Suggestions
The **dish selection is the heart of the app** and lives on the main screen (not in onboarding). The user picks dishes for their weekly plan, and the app continuously suggests new dishes based on ingredient overlap with already-selected dishes. This is an always-available, iterative process — not a one-time setup.

### Onboarding (one-time setup)
Onboarding runs once on first launch and collects the user's profile:
1. **Name** — first name, last name
2. **Email** — for account/communication
3. **Location** — for nearby supermarket deals (future feature)
4. **Intolerances / dietary restrictions** — to filter out incompatible dishes
5. **Preference slider** — variety ↔ cost savings (α parameter for the overlap algorithm)

After onboarding, the user goes straight to the main dish selection screen. Onboarding data can be edited later in the profile.

### MVP Scope (Phase 1)

1. Onboarding — one-time profile setup (name, email, location, intolerances, preference slider)
2. Dish selection — browse/search dishes, add to weekly plan
3. Overlap-based suggestions — app suggests dishes that share ingredients with current selection
4. Overlap slider — variety ↔ cost savings (set in onboarding, adjustable anytime)
5. Weekly plan view — assign dishes to weekdays, drag & drop
6. Shopping list — auto-generated, consolidated quantities
7. Profile management — edit onboarding data (intolerances, preferences, etc.)

Out of scope for MVP: supermarket price comparison, optimal package sizes, organic/regional filters, supermarket API integration, location-based deals.

## Development Principles

- **Mobile-first**: primary use is on phones (kitchen, supermarket)
- **Iterative**: each feature minimal first, then refined
- **Sparring before coding**: discuss requirements before implementation
- **Small steps**: one feature/component at a time, each step deployable and testable
- **Document decisions**: record important architecture decisions
- **Ask when unclear**: always clarify requirements before coding
- **Track progress**: after every significant change (new feature, setup step, schema change), update the project progress memory (`memory/project_progress.md`) so the next session knows exactly where we left off. This includes: what was completed, what's next, and any blockers or open questions.

## Git & GitHub Workflow

Claude acts as a GitHub engineer — all changes are trackable, revertable, and go through proper version control.

### Branching Strategy
- **`main`** is always stable and deployable. Never commit directly to `main`.
- Feature work: `feature/<short-description>` (e.g. `feature/onboarding-ui`)
- Bug fixes: `fix/<short-description>` (e.g. `fix/overlap-score-calc`)
- Docs/config: `chore/<short-description>` (e.g. `chore/update-claude-md`)

### Commit Practices
- Small, focused commits — each one a logical unit of work
- Clear commit messages: imperative mood, explain *what* and *why*
- Never skip hooks or bypass signing

### Pull Requests
- Every change reaches `main` through a PR — no exceptions
- PR title: concise summary. PR body: what changed and why.
- Use draft PRs for work-in-progress

### Merge Strategy
- **Squash & merge** feature branches into `main` — one clean commit per feature/fix
- Delete the feature branch after merge

### Revertability
- Each feature is an isolated PR that can be reverted cleanly
- Keep PRs focused on one concern to make reverts safe
