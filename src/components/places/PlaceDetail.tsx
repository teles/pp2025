import { X, MapPin, ExternalLink } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import type { Place } from '@/types/place'
import { TAG_LABELS } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PlaceCarousel } from './PlaceCarousel'
import { PlaceMap } from './PlaceMap'

interface PlaceDetailProps {
  place: Place | null
  onClose: () => void
}

export function PlaceDetail({ place, onClose }: PlaceDetailProps) {
  return (
    <Dialog.Root open={!!place} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed right-0 top-0 z-50 flex flex-col h-dvh w-full max-w-md bg-dark-800 shadow-2xl border-l border-white/10
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right
            duration-300"
        >
          {place && (
            <>
              {/* Scrollable area */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <PlaceCarousel slug={place.slug} nome={place.nome} />

                <div className="p-5 space-y-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <Dialog.Title className="text-xl font-bold text-white leading-tight">
                        {place.nome}
                      </Dialog.Title>
                      {place.instagram && (
                        <a
                          href={`https://instagram.com/${place.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 inline-flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 transition-colors"
                        >
                          <span className="text-base">@</span>
                          {place.instagram}
                        </a>
                      )}
                    </div>
                    <Dialog.Close asChild>
                      <button
                        aria-label="Fechar"
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {place.cuisineTags.map((tag) => (
                      <Badge key={tag} variant="cuisine">{TAG_LABELS[tag]}</Badge>
                    ))}
                    {place.promoTags.map((tag) => (
                      <Badge key={tag} variant="promo">{TAG_LABELS[tag]}</Badge>
                    ))}
                  </div>

                  {/* Endereço */}
                  {place.endereco !== 'Sem endereço definido' && (
                    <div className="flex items-start gap-2 text-sm text-white/70">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-brand-400" />
                      <span>{place.endereco}, Pinheiros, São Paulo</span>
                    </div>
                  )}

                  {/* Experiência */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-400">
                      🎫 Experiência
                    </p>
                    <p className="text-sm leading-relaxed text-white/80">{place.experiencia}</p>
                  </div>

                  {/* Map */}
                  {place.lat && (
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-400">
                        📍 Localização
                      </p>
                      <PlaceMap place={place} />
                    </div>
                  )}
                </div>
              </div>

              {/* Fixed bottom CTA */}
              <div className="flex-shrink-0 border-t border-white/10 bg-dark-800 p-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    place.lat
                      ? `${place.endereco} Pinheiros São Paulo`
                      : `${place.nome} Pinheiros São Paulo`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full"
                >
                  <Button className="w-full" variant="brand">
                    <ExternalLink className="h-4 w-4" />
                    Ver no Google Maps
                  </Button>
                </a>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// Re-export for consumer convenience
export type { PlaceDetailProps }
