import { useState, useEffect, useMemo } from 'react'
import { usePlaces } from '@/hooks/usePlaces'
import { usePlaceFilter } from '@/hooks/usePlaceFilter'
import { useTheme } from '@/hooks/useTheme'
import type { Place } from '@/types/place'
import { haversineKm } from '@/lib/geo'
import { Header } from '@/components/places/Header'
import { FilterBar } from '@/components/ui/FilterBar'
import { PlaceGrid } from '@/components/places/PlaceGrid'
import { PlaceDetail } from '@/components/places/PlaceDetail'
import { FooterMap } from '@/components/places/FooterMap'
import { Footer } from '@/components/ui/Footer'

type LocationStatus = 'idle' | 'loading' | 'ready' | 'unsupported' | 'denied' | 'error'
type SortMode = 'default' | 'distance'

export default function App() {
  const { places, loading, error } = usePlaces()
  const { search, setSearch, selectedTags, toggleTag, clearTags, filteredPlaces } =
    usePlaceFilter(places)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [sortMode, setSortMode] = useState<SortMode>('default')
  const { theme, toggle: toggleTheme } = useTheme()
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

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

  function requestUserLocation() {
    if (!('geolocation' in navigator)) {
      setLocationStatus('unsupported')
      setSortMode('default')
      return
    }

    setLocationStatus('loading')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocationStatus('ready')
        setSortMode('distance')
      },
      (geoError) => {
        setLocationStatus(geoError.code === 1 ? 'denied' : 'error')
        setSortMode('default')
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      },
    )
  }

  function handleSortModeChange(mode: SortMode) {
    if (mode === 'default') {
      setSortMode('default')
      return
    }

    if (userLocation) {
      setSortMode('distance')
      setLocationStatus('ready')
      return
    }

    requestUserLocation()
  }

  const distanceBySlug = useMemo(() => {
    if (!userLocation) return {}

    const distances: Record<string, number> = {}

    for (const place of filteredPlaces) {
      if (place.lat == null || place.lng == null) continue
      distances[place.slug] = haversineKm(userLocation, { lat: place.lat, lng: place.lng })
    }

    return distances
  }, [filteredPlaces, userLocation])

  const orderedPlaces = useMemo(() => {
    if (sortMode !== 'distance' || !userLocation) return filteredPlaces

    const list = [...filteredPlaces]
    list.sort((a, b) => {
      const da = distanceBySlug[a.slug]
      const db = distanceBySlug[b.slug]

      if (da == null && db == null) return a.nome.localeCompare(b.nome)
      if (da == null) return 1
      if (db == null) return -1
      return da - db
    })

    return list
  }, [filteredPlaces, sortMode, userLocation, distanceBySlug])

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
        count={orderedPlaces.length}
        total={places.length}
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      <FilterBar
        selectedTags={selectedTags}
        onToggle={toggleTag}
        onClear={clearTags}
        sortMode={sortMode}
        onSortModeChange={handleSortModeChange}
        locationStatus={locationStatus}
      />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <PlaceGrid
          places={orderedPlaces}
          selectedPlace={selectedPlace}
          onSelect={handleSelect}
          distances={sortMode === 'distance' ? distanceBySlug : undefined}
        />
      </main>

      <FooterMap places={orderedPlaces} onSelect={handleSelect} />

      <Footer />

      <PlaceDetail place={selectedPlace} onClose={() => { setSelectedPlace(null); syncLugar(null) }} />
    </div>
  )
}
