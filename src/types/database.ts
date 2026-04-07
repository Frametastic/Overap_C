export interface Zutat {
  id: string
  name: string
  einheit: string
  kategorie: ZutatKategorie
  preis_pro_einheit: number | null
  created_at: string
}

export type ZutatKategorie =
  | 'Gemüse'
  | 'Obst'
  | 'Fleisch'
  | 'Fisch'
  | 'Milchprodukte'
  | 'Getreide'
  | 'Gewürze'
  | 'Sonstiges'

export interface Gericht {
  id: string
  name: string
  kategorie: GerichtKategorie
  beschreibung: string | null
  created_at: string
}

export type GerichtKategorie =
  | 'Frühstück'
  | 'Mittagessen'
  | 'Abendessen'
  | 'Snack'

export interface GerichtZutat {
  id: string
  gericht_id: string
  zutat_id: string
  menge: number
  einheit: string
}

export interface Profil {
  id: string
  name: string | null
  created_at: string
}

export interface Wochenplan {
  id: string
  profil_id: string
  woche_start: string
  created_at: string
}

export interface WochenplanEintrag {
  id: string
  wochenplan_id: string
  gericht_id: string
  wochentag: number
  mahlzeit: GerichtKategorie
}

// Joined types for queries
export interface GerichtMitZutaten extends Gericht {
  zutaten: (GerichtZutat & { zutat: Zutat })[]
}
