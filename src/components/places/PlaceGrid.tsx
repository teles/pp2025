import type { Place } from '@/types/place'
import { PlaceCard } from './PlaceCard'

interface PlaceGridProps {
  places: Place[]
  selectedPlace: Place | null
  onSelect: (place: Place) => void
  distances?: Record<string, number>
  isFavorite?: (slug: string) => boolean
  onToggleFavorite?: (slug: string) => void
  visitCount?: (slug: string) => number
}

export function PlaceGrid({ places, selectedPlace, onSelect, distances, isFavorite, onToggleFavorite, visitCount }: PlaceGridProps) {
  if (places.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <p className="text-4xl mb-3">🔍</p>
        <p className="font-semibold text-white/70">Nenhum estabelecimento encontrado</p>
        <p className="text-sm text-white/40 mt-1">Tente outro termo ou remova os filtros</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {places.map((place) => (
        <PlaceCard
          key={place.slug}
          place={place}
          selected={selectedPlace?.slug === place.slug}
          onSelect={onSelect}
          distanceKm={distances?.[place.slug]}
          isFavorite={isFavorite?.(place.slug)}
          onToggleFavorite={onToggleFavorite}
          visitCount={visitCount?.(place.slug)}
        />
      ))}
    </div>
  )
}
