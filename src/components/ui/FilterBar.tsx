import { cn } from '@/lib/utils'
import type { Tag } from '@/types/place'
import { CUISINE_TAGS, PROMO_TAGS, TAG_LABELS } from '@/lib/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select'
import { ArrowUpDown } from 'lucide-react'

type SortMode = 'default' | 'distance'
type LocationStatus = 'idle' | 'loading' | 'ready' | 'unsupported' | 'denied' | 'error'

interface FilterChipProps {
  tag: Tag
  selected: boolean
  onToggle: (tag: Tag) => void
}

export function FilterChip({ tag, selected, onToggle }: FilterChipProps) {
  const isCuisine = (CUISINE_TAGS as string[]).includes(tag)
  return (
    <button
      onClick={() => onToggle(tag)}
      className={cn(
        'shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-all',
        selected && isCuisine  && 'bg-brand-500 border-brand-500 text-white',
        selected && !isCuisine && 'bg-emerald-500 border-emerald-500 text-white',
        !selected && 'border-white/20 text-white/60 hover:border-white/40 hover:text-white/80',
      )}
    >
      {TAG_LABELS[tag]}
    </button>
  )
}

interface FilterBarProps {
  selectedTags: Tag[]
  onToggle: (tag: Tag) => void
  onClear: () => void
  sortMode: SortMode
  onSortModeChange: (mode: SortMode) => void
  locationStatus: LocationStatus
}

// Compact on mobile (icon only), full label+value on sm+
function SortSelectTrigger({ sortMode }: { sortMode: SortMode }) {
  const label = sortMode === 'distance' ? 'Próximo a mim' : 'Padrão (nome)'
  return (
    <SelectTrigger className="px-2 sm:px-3">
      <ArrowUpDown className={cn('sm:hidden h-3.5 w-3.5 shrink-0', sortMode === 'distance' ? 'text-brand-400' : 'text-white/50')} />
      <span className="hidden sm:inline text-xs">
        <span className="text-white/30 mr-0.5">Ordenar:</span>
        {label}
      </span>
    </SelectTrigger>
  )
}

function getSortStatusText(status: LocationStatus): string | null {
  if (status === 'loading') return 'Buscando sua localizacao...'
  if (status === 'unsupported') return 'Seu navegador nao suporta geolocalizacao.'
  if (status === 'denied') return 'Permissao de localizacao negada.'
  if (status === 'error') return 'Nao foi possivel obter sua localizacao.'
  return null
}

export function FilterBar({
  selectedTags,
  onToggle,
  onClear,
  sortMode,
  onSortModeChange,
  locationStatus,
}: FilterBarProps) {
  const sortStatusText = getSortStatusText(locationStatus)

  return (
    <div className="border-b border-white/10 bg-dark-800 px-4 py-3 space-y-2.5">
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline shrink-0 text-xs font-bold uppercase tracking-widest text-white/30 w-20">Culinária</span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {CUISINE_TAGS.map((tag) => (
            <FilterChip key={tag} tag={tag} selected={selectedTags.includes(tag)} onToggle={onToggle} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline shrink-0 text-xs font-bold uppercase tracking-widest text-white/30 w-20">Promoção</span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin] flex-1 min-w-0">
          {PROMO_TAGS.map((tag) => (
            <FilterChip key={tag} tag={tag} selected={selectedTags.includes(tag)} onToggle={onToggle} />
          ))}
        </div>
        <div className="shrink-0 ml-1">
          <Select value={sortMode} onValueChange={(v) => onSortModeChange(v as SortMode)}>
            <SortSelectTrigger sortMode={sortMode} />
            <SelectContent align="end">
              <SelectItem value="default">Padrão (nome)</SelectItem>
              <SelectItem value="distance">Próximo a mim</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/40">Filtrando:</span>
          {selectedTags.map((tag) => {
            const isCuisine = (CUISINE_TAGS as string[]).includes(tag)
            return (
              <span
                key={tag}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                  isCuisine ? 'bg-brand-500/20 text-brand-300' : 'bg-emerald-500/20 text-emerald-300',
                )}
              >
                {TAG_LABELS[tag]}
                <button onClick={() => onToggle(tag)} className="hover:opacity-70 leading-none ml-0.5">×</button>
              </span>
            )
          })}
          <button onClick={onClear} className="text-xs text-white/40 underline hover:text-white/70">
            limpar
          </button>
        </div>
      )}
    </div>
  )
}
