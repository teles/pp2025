import { useState } from 'react'
import { X, MapPin, ExternalLink, Heart, Stamp, Plus, Trash2, MessageSquare } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import type { Place } from '@/types/place'
import type { Visit } from '@/services/storageService'
import { TAG_LABELS } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PlaceCarousel } from './PlaceCarousel'
import { PlaceMap } from './PlaceMap'
import { AddVisitDialog } from './AddVisitDialog'
import { cn } from '@/lib/utils'

interface PlaceDetailProps {
  place: Place | null
  onClose: () => void
  isFavorite?: boolean
  onToggleFavorite?: (slug: string) => void
  visits?: Visit[]
  onAddVisit?: (slug: string, date: string, comment: string) => void
  onRemoveVisit?: (slug: string, visitNumber: 1 | 2) => void
}

export function PlaceDetail({ place, onClose, isFavorite, onToggleFavorite, visits = [], onAddVisit, onRemoveVisit }: PlaceDetailProps) {
  const [addVisitOpen, setAddVisitOpen] = useState(false)
  const placeVisits = visits.filter((v) => v.slug === place?.slug)
  const canAddVisit = placeVisits.length < 2
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
              {/* Close button - top right */}
              <div className="absolute top-3 right-3 z-10">
                <Dialog.Close asChild>
                  <button
                    aria-label="Fechar"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-pure-white/90 hover:bg-brand-500/80 hover:text-pure-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>

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
                          {place.instagram}
                        </a>
                      )}
                    </div>
                    {onToggleFavorite && (
                      <button
                        onClick={() => onToggleFavorite(place.slug)}
                        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors',
                          isFavorite
                            ? 'bg-red-500/15 hover:bg-red-500/25'
                            : 'bg-white/10 hover:bg-white/20',
                        )}
                      >
                        <Heart
                          className={cn(
                            'h-5 w-5 transition-colors',
                            isFavorite ? 'fill-red-500 text-red-500' : 'text-white/60',
                          )}
                        />
                      </button>
                    )}
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
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand-400" />
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

                  {/* Visitas */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-400">
                        <Stamp className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                        Carimbos ({placeVisits.length}/2)
                      </p>
                      {canAddVisit && onAddVisit && (
                        <button
                          onClick={() => setAddVisitOpen(true)}
                          className="flex items-center gap-1 rounded-lg border border-brand-500/30 bg-brand-500/10 px-2 py-1 text-xs font-medium text-brand-300 hover:bg-brand-500/20 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                          Registrar visita
                        </button>
                      )}
                    </div>

                    {placeVisits.length === 0 ? (
                      <p className="text-xs text-white/30">Nenhuma visita registrada.</p>
                    ) : (
                      <div className="space-y-2">
                        {placeVisits.map((visit) => (
                          <div
                            key={visit.visitNumber}
                            className="flex items-start gap-3 rounded-xl border border-white/10 bg-dark-900 p-3"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold">
                              #{visit.visitNumber}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-white/70">
                                {new Date(visit.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </p>
                              {visit.comment && (
                                <p className="mt-1 text-xs text-white/40 flex items-start gap-1">
                                  <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                                  {visit.comment}
                                </p>
                              )}
                            </div>
                            {onRemoveVisit && (
                              <button
                                onClick={() => onRemoveVisit(place.slug, visit.visitNumber)}
                                aria-label={`Remover visita ${visit.visitNumber}`}
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {placeVisits.length === 2 && (
                      <p className="mt-2 text-xs text-brand-400 font-medium">
                        ✅ Todas as visitas registradas!
                      </p>
                    )}
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
              <div className="shrink-0 border-t border-white/10 bg-dark-800 p-4">
                <p className="mb-3 text-xs text-white/50 hidden">
                  Para usar o benefício, apresente o Passaporte Pinheiros físico no local.
                </p>
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

      {/* Add Visit Dialog (nested outside Content to avoid z-index fighting) */}
      {place && onAddVisit && (
        <AddVisitDialog
          open={addVisitOpen}
          onOpenChange={setAddVisitOpen}
          placeName={place.nome}
          visitNumber={(placeVisits.length + 1) as 1 | 2}
          onConfirm={(date, comment) => onAddVisit(place.slug, date, comment)}
        />
      )}
    </Dialog.Root>
  )
}

// Re-export for consumer convenience
export type { PlaceDetailProps }
