-- MealOverlap Schema Migration
-- Run this in the Supabase SQL Editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- Zutaten (Ingredients)
-- ============================================================
create table zutaten (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  einheit text not null,
  kategorie text not null check (kategorie in (
    'Gemüse', 'Obst', 'Fleisch', 'Fisch',
    'Milchprodukte', 'Getreide', 'Gewürze', 'Sonstiges'
  )),
  created_at timestamptz default now()
);

-- ============================================================
-- Gerichte (Dishes)
-- ============================================================
create table gerichte (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  kategorie text not null check (kategorie in (
    'Frühstück', 'Mittagessen', 'Abendessen', 'Snack'
  )),
  beschreibung text,
  created_at timestamptz default now()
);

-- ============================================================
-- Gericht ↔ Zutaten (m2m with quantity)
-- ============================================================
create table gericht_zutaten (
  id uuid primary key default uuid_generate_v4(),
  gericht_id uuid not null references gerichte(id) on delete cascade,
  zutat_id uuid not null references zutaten(id) on delete cascade,
  menge numeric not null,
  einheit text not null,
  unique (gericht_id, zutat_id)
);

create index idx_gericht_zutaten_gericht on gericht_zutaten(gericht_id);
create index idx_gericht_zutaten_zutat on gericht_zutaten(zutat_id);

-- ============================================================
-- Profile (User profiles — minimal for mock auth)
-- ============================================================
create table profile (
  id uuid primary key default uuid_generate_v4(),
  name text,
  created_at timestamptz default now()
);

-- ============================================================
-- Profil ↔ Gerichte (favorite dishes)
-- ============================================================
create table profil_gerichte (
  profil_id uuid not null references profile(id) on delete cascade,
  gericht_id uuid not null references gerichte(id) on delete cascade,
  primary key (profil_id, gericht_id)
);

-- ============================================================
-- Profil ↔ Zutaten (preferred ingredients)
-- ============================================================
create table profil_zutaten (
  profil_id uuid not null references profile(id) on delete cascade,
  zutat_id uuid not null references zutaten(id) on delete cascade,
  primary key (profil_id, zutat_id)
);

-- ============================================================
-- Wochenpläne (Meal plans)
-- ============================================================
create table wochenplaene (
  id uuid primary key default uuid_generate_v4(),
  profil_id uuid not null references profile(id) on delete cascade,
  woche_start date not null,
  created_at timestamptz default now()
);

-- ============================================================
-- Wochenplan-Einträge (Meal plan entries)
-- ============================================================
create table wochenplan_eintraege (
  id uuid primary key default uuid_generate_v4(),
  wochenplan_id uuid not null references wochenplaene(id) on delete cascade,
  gericht_id uuid not null references gerichte(id) on delete cascade,
  wochentag smallint not null check (wochentag between 0 and 6),
  mahlzeit text not null check (mahlzeit in (
    'Frühstück', 'Mittagessen', 'Abendessen', 'Snack'
  )),
  unique (wochenplan_id, wochentag, mahlzeit)
);

create index idx_wochenplan_eintraege_plan on wochenplan_eintraege(wochenplan_id);

-- ============================================================
-- Row Level Security (basic — open for now, restrict later with real auth)
-- ============================================================
alter table zutaten enable row level security;
alter table gerichte enable row level security;
alter table gericht_zutaten enable row level security;
alter table profile enable row level security;
alter table profil_gerichte enable row level security;
alter table profil_zutaten enable row level security;
alter table wochenplaene enable row level security;
alter table wochenplan_eintraege enable row level security;

-- Allow public read access to dishes and ingredients (reference data)
create policy "Zutaten sind öffentlich lesbar" on zutaten for select using (true);
create policy "Gerichte sind öffentlich lesbar" on gerichte for select using (true);
create policy "Gericht-Zutaten sind öffentlich lesbar" on gericht_zutaten for select using (true);

-- Allow all operations on user-specific tables (will be scoped to auth.uid() later)
create policy "Profile: voller Zugriff" on profile for all using (true);
create policy "Profil-Gerichte: voller Zugriff" on profil_gerichte for all using (true);
create policy "Profil-Zutaten: voller Zugriff" on profil_zutaten for all using (true);
create policy "Wochenpläne: voller Zugriff" on wochenplaene for all using (true);
create policy "Wochenplan-Einträge: voller Zugriff" on wochenplan_eintraege for all using (true);
