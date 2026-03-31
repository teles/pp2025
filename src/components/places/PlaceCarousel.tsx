import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { withBase } from '@/lib/utils'

const SLIDES = ['logo', 'foto-1', 'foto-2', 'foto-3'] as const

interface PlaceCarouselProps {
  slug: string
  nome: string
}

export function PlaceCarousel({ slug, nome }: PlaceCarouselProps) {
  const [slide, setSlide] = useState(0)
  // Track which images have finished loading to show skeleton until ready
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})

  const prev = () => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setSlide((s) => (s + 1) % SLIDES.length)

  return (
    <div className="relative overflow-hidden bg-dark-900" style={{ aspectRatio: '16/9' }}>
      {SLIDES.map((img, i) => (
        <div key={img} className={`absolute inset-0 transition-opacity duration-300 ${slide === i ? 'opacity-100' : 'opacity-0'}`}>
          {/* Skeleton shown until image loads */}
          {!loaded[img] && (
            <div className="absolute inset-0 bg-dark-700 animate-pulse" />
          )}
          <img
            src={withBase(`images/${slug}/${img}.jpg`)}
            alt={`${nome} – ${img}`}
            loading="lazy"
            onLoad={() => setLoaded((prev) => ({ ...prev, [img]: true }))}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${loaded[img] ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      ))}

      <button
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-pure-white/90 hover:bg-brand-500/80 hover:text-pure-white transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <button
        onClick={next}
        aria-label="Próximo"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-pure-white/90 hover:bg-brand-500/80 hover:text-pure-white transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {SLIDES.map((img, i) => (
          <button
            key={img}
            onClick={() => setSlide(i)}
            aria-label={`Foto ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              slide === i ? 'w-4 bg-brand-400' : 'w-1.5 bg-pure-white/40'
            }`}
          />
        ))}
      </div>

      <div className="absolute top-2 left-2 z-10">
        <span className="rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-pure-white/90">
          {slide === 0 ? 'Logo' : `Foto ${slide}`}
        </span>
      </div>
    </div>
  )
}
