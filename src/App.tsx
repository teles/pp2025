import { useState, useEffect } from 'react'
import { usePlaces } from '@/hooks/usePlaces'
import { usePlaceFilter } from '@/hooks/usePlaceFilter'
import type { Place } from '@/types/place'
import { Header } from '@/components/places/Header'
import { FilterBar } from '@/components/ui/FilterBar'
import { PlaceGrid } from '@/components/places/PlaceGrid'
import { PlaceDetail } from '@/components/places/PlaceDetail'
import { FooterMap } from '@/components/places/FooterMap'

export default function App() {
  const { places, loading, error } = usePlaces()
  const { search, setSearch, selectedTags, toggleTag, clearTags, filteredPlaces } =
    usePlaceFilter(places)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  // Restore selected place from URL once data is loaded
  useEffect(() => {
    if (!places.length) return
    const slug = new URLSearchParams(window.location.search).get('lugar')
    if (slug) setSelectedPlace(places.find((p) => p.slug === slug) ?? null)
  }, [places])

  function syncLugar(place: Place | null) {
    const params = new URLSearchParams(window.location.search)
    if (place) params.set('lugar', place.slug)
    else params.delete('lugar')
    const qs = params.toString()
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
  }

  function handleSelect(place: Place) {
    setSelectedPlace((prev) => {
      const next = prev?.slug === place.slug ? null : place
      syncLugar(next)
      return next
    })
  }

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-brand-400/30 border-t-brand-400 animate-spin" />
          <p className="text-sm text-white/50">Carregando estabelecimentos…</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-400">Erro ao carregar dados: {error}</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-dark-900">
      <Header
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          setSelectedPlace(null)
        }}
        count={filteredPlaces.length}
        total={places.length}
      />

      <FilterBar selectedTags={selectedTags} onToggle={toggleTag} onClear={clearTags} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <PlaceGrid
          places={filteredPlaces}
          selectedPlace={selectedPlace}
          onSelect={handleSelect}
        />
      </main>

      <FooterMap places={filteredPlaces} onSelect={handleSelect} />

      <PlaceDetail place={selectedPlace} onClose={() => { setSelectedPlace(null); syncLugar(null) }} />
    </div>
  )
}
