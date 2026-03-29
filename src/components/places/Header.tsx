import { Search } from 'lucide-react'

interface HeaderProps {
  search: string
  onSearchChange: (value: string) => void
  count: number
  total: number
}

export function Header({ search, onSearchChange, count, total }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-xl">
            🍽
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none text-white">Passaporte Pinheiros</h1>
            <p className="text-xs text-white/40 mt-0.5">
              {count === total ? `${total} estabelecimentos` : `${count} de ${total}`}
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
          <input
            type="search"
            placeholder="Buscar estabelecimento..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-dark-800 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/30
              focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
          />
        </div>
      </div>
    </header>
  )
}
