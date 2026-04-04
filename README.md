# MealOverlap

Meal planning app that uses ingredient overlap to reduce food waste and shopping costs.

## Setup

```bash
pnpm install
cp .env.example .env  # fill in Supabase credentials
pnpm dev
```

## Database

Run the SQL files in `supabase/migrations/` in order via the Supabase SQL Editor:

1. `001_schema.sql` — creates all tables
2. `002_seed.sql` — inserts 50 recipes with ingredients
