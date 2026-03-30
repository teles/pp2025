export interface Visit {
  slug: string
  date: string      // ISO date string YYYY-MM-DD
  comment: string   // optional, may be empty
  visitNumber: 1 | 2
}

const FAVORITES_KEY = 'pp:favorites'
const VISITS_KEY = 'pp:visits'

// ── Favorites ────────────────────────────────────────────────

export function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

export function saveFavorites(favs: Set<string>): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favs]))
  } catch { /* quota exceeded — silently ignore */ }
}

// ── Visits ───────────────────────────────────────────────────

export function loadVisits(): Visit[] {
  try {
    const raw = localStorage.getItem(VISITS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Visit[]
  } catch {
    return []
  }
}

export function saveVisits(visits: Visit[]): void {
  try {
    localStorage.setItem(VISITS_KEY, JSON.stringify(visits))
  } catch { /* quota exceeded — silently ignore */ }
}
