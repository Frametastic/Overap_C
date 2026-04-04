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

- **User** → preferred dishes (m2m), preferred ingredients (m2m), meal plans (1:n)
- **Gericht (Dish)** → ingredients (m2m with quantity + unit), category (breakfast/lunch/dinner/snack)
- **Zutat (Ingredient)** → name, unit, category
- **Wochenplan (Meal Plan)** → week date, entries (dish + weekday + meal slot)
- **Einkaufsliste (Shopping List)** → auto-aggregated from meal plan

## MVP Scope (Phase 1)

1. Onboarding — user picks favorite dishes and/or ingredients
2. Dish suggestions — based on overlap with already-selected dishes
3. Overlap slider — variety ↔ cost savings
4. Weekly plan view — assign dishes to weekdays, drag & drop
5. Shopping list — auto-generated, consolidated quantities
6. Profile management — edit onboarding selections

Out of scope for MVP: supermarket price comparison, optimal package sizes, organic/regional filters, supermarket API integration.

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
