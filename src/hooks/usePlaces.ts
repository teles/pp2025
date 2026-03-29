import { useState, useEffect } from 'react'
import type { Place } from '@/types/place'
import { fetchPlaces } from '@/services/placesService'

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlaces()
      .then(setPlaces)
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  return { places, loading, error }
}
