import { useCallback, useState } from 'react'
import { loadFavorites, saveFavorites } from '@/services/storageService'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites())

  const toggle = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      saveFavorites(next)
      return next
    })
  }, [])

  const isFavorite = useCallback((slug: string) => favorites.has(slug), [favorites])

  return { favorites, toggle, isFavorite, count: favorites.size }
}
