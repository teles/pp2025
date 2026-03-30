import { Heart, Stamp, TicketCheck, ArrowUpDown, SlidersHorizontal, X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

type SortMode = 'default' | 'distance'
type LocationStatus = 'idle' | 'loading' | 'ready' | 'unsupported' | 'denied' | 'error'

export interface FilterModalFilters {
  showFavorites: boolean
  showVisited: boolean
  showRemaining: boolean
  sortMode: SortMode
}

interface FilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: FilterModalFilters
  onFiltersChange: (filters: FilterModalFilters) => void
  onSortModeChange: (mode: SortMode) => void
  locationStatus: LocationStatus
  favoritesCount: number
  visitedCount: number
  activeFilterCount: number
}

function getSortStatusText(status: LocationStatus): string | null {
  if (status === 'loading') return 'Buscando sua localização...'
  if (status === 'unsupported') return 'Seu navegador não suporta geolocalização.'
  if (status === 'denied') return 'Permissão de localização negada.'
  if (status === 'error') return 'Não foi possível obter sua localização.'
  return null
}

export function FilterModal({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onSortModeChange,
  locationStatus,
  favoritesCount,
  visitedCount,
  activeFilterCount,
}: FilterModalProps) {
  const sortStatusText = getSortStatusText(locationStatus)

  function toggle(key: keyof Omit<FilterModalFilters, 'sortMode'>) {
    const next = { ...filters, [key]: !filters[key] }
    // "visited" and "remaining" are mutually exclusive
    if (key === 'showVisited' && next.showVisited) next.showRemaining = false
    if (key === 'showRemaining' && next.showRemaining) next.showVisited = false
    onFiltersChange(next)
  }

  function handleSortChange(mode: SortMode) {
    onSortModeChange(mode)
  }

  function clearAll() {
    onFiltersChange({ showFavorites: false, showVisited: false, showRemaining: false, sortMode: 'default' })
    if (filters.sortMode === 'distance') onSortModeChange('default')
  }

  const hasActiveFilters = filters.showFavorites || filters.showVisited || filters.showRemaining || filters.sortMode === 'distance'

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => onOpenChange(true)}
        className={cn(
          'relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
          activeFilterCount > 0
            ? 'bg-brand-500/20 border-brand-500/50 text-brand-300'
            : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white/80',
        )}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Filtros</span>
        {activeFilterCount > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-pure-white px-1">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Modal */}
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-70 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-dark-800 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <Dialog.Title className="text-base font-bold text-white">
                Filtros e ordenação
              </Dialog.Title>
              <Dialog.Close asChild>
                <button aria-label="Fechar" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </Dialog.Close>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">
              {/* Filter section */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Exibir</h3>
                <div className="space-y-1.5">
                  <FilterToggle
                    active={filters.showFavorites}
                    onClick={() => toggle('showFavorites')}
                    icon={<Heart className={cn('h-4 w-4', filters.showFavorites && 'fill-red-400 text-red-400')} />}
                    label="Favoritos"
                    count={favoritesCount}
                    activeColor="red"
                  />
                  <FilterToggle
                    active={filters.showVisited}
                    onClick={() => toggle('showVisited')}
                    icon={<Stamp className="h-4 w-4" />}
                    label="Visitados"
                    count={visitedCount}
                    activeColor="brand"
                  />
                  <FilterToggle
                    active={filters.showRemaining}
                    onClick={() => toggle('showRemaining')}
                    icon={<TicketCheck className="h-4 w-4" />}
                    label="Com visitas restantes"
                    activeColor="amber"
                  />
                </div>
              </div>

              {/* Sort section */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Ordenar por</h3>
                <div className="space-y-1.5">
                  <SortOption
                    active={filters.sortMode === 'default'}
                    onClick={() => handleSortChange('default')}
                    label="Nome (A–Z)"
                  />
                  <SortOption
                    active={filters.sortMode === 'distance'}
                    onClick={() => handleSortChange('distance')}
                    label="Próximo a mim"
                    loading={locationStatus === 'loading'}
                  />
                </div>
                {sortStatusText && (
                  <p className="text-xs text-white/50 mt-1">{sortStatusText}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
              <button
                onClick={clearAll}
                disabled={!hasActiveFilters}
                className="text-xs text-white/40 underline hover:text-white/70 disabled:opacity-30 disabled:no-underline disabled:cursor-default transition-colors"
              >
                Limpar filtros
              </button>
              <Dialog.Close asChild>
                <button className="rounded-xl bg-brand-500 hover:bg-brand-400 px-5 py-2 text-sm font-medium text-pure-white transition-colors">
                  Aplicar
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

/* ── Subcomponents ──────────────────────────────────────── */

function FilterToggle({
  active,
  onClick,
  icon,
  label,
  count,
  activeColor,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  count?: number
  activeColor: 'red' | 'brand' | 'amber'
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all',
        active && activeColor === 'red' && 'bg-red-500/15 text-red-300 ring-1 ring-red-500/30',
        active && activeColor === 'brand' && 'bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30',
        active && activeColor === 'amber' && 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
        !active && 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80',
      )}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {count != null && (
        <span className="text-xs opacity-60">{count}</span>
      )}
    </button>
  )
}

function SortOption({
  active,
  onClick,
  label,
  loading,
}: {
  active: boolean
  onClick: () => void
  label: string
  loading?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all',
        active
          ? 'bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30'
          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80',
      )}
    >
      <ArrowUpDown className="h-4 w-4" />
      <span className="flex-1 text-left">{label}</span>
      {loading && (
        <div className="h-3.5 w-3.5 rounded-full border border-brand-400/30 border-t-brand-400 animate-spin" />
      )}
    </button>
  )
}
