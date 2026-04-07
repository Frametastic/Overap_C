import { supabase } from './supabase'
import type { GerichtKategorie } from '@/types/database'

export interface ZutatInfo {
  id: string
  name: string
  menge: number
  einheit: string
  kategorie: string
}

export interface GerichtCard {
  id: string
  name: string
  kategorie: GerichtKategorie
  beschreibung: string | null
  zutaten: ZutatInfo[]
  zutatIds: Set<string>
  kostenEuro: number
}

export async function fetchGerichte(): Promise<GerichtCard[]> {
  const { data, error } = await supabase
    .from('gerichte')
    .select(`
      id, name, kategorie, beschreibung,
      gericht_zutaten (
        menge, einheit,
        zutaten ( id, name, preis_pro_einheit, kategorie )
      )
    `)

  if (error) throw error

  return (data ?? []).map((g: any) => {
    const zutaten = (g.gericht_zutaten ?? []).map((gz: any) => ({
      id: gz.zutaten.id,
      name: gz.zutaten.name,
      menge: gz.menge,
      einheit: gz.einheit,
      kategorie: gz.zutaten.kategorie ?? 'Sonstiges',
    }))

    const zutatIds = new Set<string>(
      (g.gericht_zutaten ?? []).map((gz: any) => gz.zutaten.id),
    )

    const kostenEuro = (g.gericht_zutaten ?? []).reduce(
      (sum: number, gz: any) => sum + gz.menge * (gz.zutaten.preis_pro_einheit ?? 0),
      0,
    )

    return {
      id: g.id,
      name: g.name,
      kategorie: g.kategorie,
      beschreibung: g.beschreibung,
      zutaten,
      zutatIds,
      kostenEuro: Math.round(kostenEuro * 100) / 100,
    }
  })
}
