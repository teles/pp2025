import { useCallback, useState } from 'react'
import { loadVisits, saveVisits, type Visit } from '@/services/storageService'

export function useVisits() {
  const [visits, setVisits] = useState<Visit[]>(() => loadVisits())

  const getVisits = useCallback(
    (slug: string) => visits.filter((v) => v.slug === slug),
    [visits],
  )

  const visitCount = useCallback(
    (slug: string) => visits.filter((v) => v.slug === slug).length,
    [visits],
  )

  const addVisit = useCallback((slug: string, date: string, comment: string) => {
    setVisits((prev) => {
      const existing = prev.filter((v) => v.slug === slug)
      if (existing.length >= 2) return prev // max 2
      const visitNumber = (existing.length + 1) as 1 | 2
      const next = [...prev, { slug, date, comment, visitNumber }]
      saveVisits(next)
      return next
    })
  }, [])

  const removeVisit = useCallback((slug: string, visitNumber: 1 | 2) => {
    setVisits((prev) => {
      const next = prev.filter((v) => !(v.slug === slug && v.visitNumber === visitNumber))
      // re-number: if we removed visit 1 and visit 2 exists, renumber it to 1
      const remaining = next.filter((v) => v.slug === slug)
      if (remaining.length === 1 && remaining[0].visitNumber === 2) {
        remaining[0].visitNumber = 1
      }
      saveVisits(next)
      return next
    })
  }, [])

  return { visits, getVisits, visitCount, addVisit, removeVisit }
}
