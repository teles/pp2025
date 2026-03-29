import { useState, useMemo, useEffect } from 'react'
import type { Place, Tag } from '@/types/place'
import { normalize } from '@/lib/utils'

function getParam(key: string): string {
  return new URLSearchParams(window.location.search).get(key) ?? ''
}

function syncParams(updates: Record<string, string | null>) {
  const params = new URLSearchParams(window.location.search)
  for (const [k, v] of Object.entries(updates)) {
    if (v) params.set(k, v)
    else params.delete(k)
  }
  const qs = params.toString()
  window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
}

export function usePlaceFilter(places: Place[]) {
  const [search, setSearch] = useState(() => getParam('q'))
  const [selectedTags, setSelectedTags] = useState<Tag[]>(() => {
    const raw = getParam('tags')
    return raw ? (raw.split(',') as Tag[]) : []
  })

  useEffect(() => {
    syncParams({ q: search || null })
  }, [search])

  useEffect(() => {
    syncParams({ tags: selectedTags.length ? selectedTags.join(',') : null })
  }, [selectedTags])

  const filteredPlaces = useMemo(() => {
    let list = places
    if (search.trim()) {
      const q = normalize(search)
      list = list.filter((p) => {
        const h = normalize(p.nome + ' ' + p.endereco + ' ' + p.experiencia)
        return h.includes(q)
      })
    }
    if (selectedTags.length > 0) {
      list = list.filter((p) => {
        const all: Tag[] = [...p.cuisineTags, ...p.promoTags]
        return selectedTags.some((t) => all.includes(t))
      })
    }
    return list
  }, [places, search, selectedTags])

  function toggleTag(tag: Tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  function clearTags() {
    setSelectedTags([])
  }

  return { search, setSearch, selectedTags, toggleTag, clearTags, filteredPlaces }
}
