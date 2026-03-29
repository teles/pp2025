import type { Place } from '@/types/place'
import { TAG_LABELS } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'
import { cn, withBase } from '@/lib/utils'

interface PlaceCardProps {
  place: Place
  selected: boolean
  onSelect: (place: Place) => void
}

export function PlaceCard({ place, selected, onSelect }: PlaceCardProps) {
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
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h2 className="text-sm font-semibold leading-tight line-clamp-2 text-white">
          {place.nome}
        </h2>
        <p className="text-xs text-white/40 truncate">
          {place.endereco !== 'Sem endereço definido' ? place.endereco : '📍 A confirmar'}
        </p>
        <div className="mt-auto flex flex-wrap gap-1 pt-1">
          {place.cuisineTags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="cuisine">{TAG_LABELS[tag]}</Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
