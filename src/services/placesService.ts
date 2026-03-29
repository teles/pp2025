import Papa from 'papaparse'
import type { Place } from '@/types/place'
import { COORDS } from '@/lib/constants'
import { inferTags } from '@/services/tagInference'
import { withBase } from '@/lib/utils'

interface RawRow {
  arquivo_original: string
  arquivo_final: string
  nome_estabelecimento: string
  instagram: string
  texto_experiencia: string
  endereco: string
}

export async function fetchPlaces(): Promise<Place[]> {
  const res = await fetch(withBase('data/data.csv'))
  const text = await res.text()

  const { data } = Papa.parse<RawRow>(text, {
    header: true,
    skipEmptyLines: true,
  })

  return data.map((row) => {
    const slug = row.arquivo_final.replace(/\.jpg$/i, '').trim()
    const nome = row.nome_estabelecimento.trim()
    const instagram = row.instagram.trim()
    const experiencia = row.texto_experiencia.trim()
    const endereco = row.endereco.trim()
    const coords = COORDS[slug] ?? null
    const { cuisineTags, promoTags } = inferTags(nome, experiencia, slug)

    return {
      slug,
      nome,
      instagram,
      experiencia,
      endereco,
      cuisineTags,
      promoTags,
      lat: coords ? coords[0] : null,
      lng: coords ? coords[1] : null,
    }
  })
}
