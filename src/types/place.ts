export type CuisineTag =
  | 'pizza'
  | 'hamburguer'
  | 'asiatico'
  | 'italiano'
  | 'mexicano'
  | 'arabe'
  | 'mediterraneo'
  | 'bar-chopp'
  | 'vinho'
  | 'cafe-brunch'
  | 'gelato'
  | 'doces'

export type PromoTag = '2por1' | '50pct' | 'happyhour' | 'rodizio'

export type Tag = CuisineTag | PromoTag

export interface Place {
  slug: string
  nome: string
  instagram: string
  experiencia: string
  endereco: string
  cuisineTags: CuisineTag[]
  promoTags: PromoTag[]
  lat: number | null
  lng: number | null
}

export interface FilterState {
  search: string
  selectedTags: Tag[]
}
