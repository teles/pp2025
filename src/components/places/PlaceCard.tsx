import type { Place } from '@/types/place'
import { TAG_LABELS } from '@/lib/constants'
import { formatDistance } from '@/lib/geo'
import { Badge } from '@/components/ui/Badge'
import { cn, withBase } from '@/lib/utils'
import { Heart, Stamp } from 'lucide-react'

interface PlaceCardProps {
  place: Place
  selected: boolean
  onSelect: (place: Place) => void
  distanceKm?: number
  isFavorite?: boolean
  onToggleFavorite?: (slug: string) => void
  visitCount?: number
}

export function PlaceCard({ place, selected, onSelect, distanceKm, isFavorite, onToggleFavorite, visitCount = 0 }: PlaceCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(place)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(place)}
      className={cn(
        'group flex flex-col rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200',
        'bg-dark-800 border-white/10',
        'hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(114,177,30,0.2)]',
        selected && 'ring-2 ring-brand-400 border-brand-400 shadow-[0_0_20px_rgba(114,177,30,0.3)]',
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-dark-700">
        <img
          src={withBase(`images/${place.slug}/foto-1.jpg`)}
          alt={place.nome}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Promo badge overlay */}
        {place.promoTags.length > 0 && (
          <div className="absolute top-2 left-2">
            <Badge variant="promo">{TAG_LABELS[place.promoTags[0]]}</Badge>
          </div>
        )}
        {/* Top-right: favorite + visits */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          {visitCount > 0 && (
            <span className="flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-brand-300 backdrop-blur-sm">
              <Stamp className="h-3 w-3" />
              {visitCount}/2
            </span>
          )}
          {onToggleFavorite && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(place.slug) }}
              aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-colors hover:bg-black/80"
            >
              <Heart
                className={cn(
                  'h-3.5 w-3.5 transition-colors',
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-white/70',
                )}
              />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h2 className="text-sm font-semibold leading-tight line-clamp-2 text-white">
          {place.nome}
        </h2>
        <p className="text-xs text-white/40 truncate">
          {place.endereco !== 'Sem endereço definido' ? place.endereco : '📍 A confirmar'}
        </p>
        {distanceKm != null && (
          <p className="text-xs text-brand-300">~{formatDistance(distanceKm)} de voce</p>
        )}
        <div className="mt-auto flex flex-wrap gap-1 pt-1">
          {place.cuisineTags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="cuisine">{TAG_LABELS[tag]}</Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
