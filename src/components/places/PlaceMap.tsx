import { useEffect, useRef } from 'react'
import L from 'leaflet'
import type { Place } from '@/types/place'

interface PlaceMapProps {
  place: Place
}

export function PlaceMap({ place }: PlaceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!place.lat || !place.lng || !containerRef.current) return

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([place.lat, place.lng], 16)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    const icon = L.divIcon({
      html: `<div style="background:#72b11e;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 10px rgba(0,0,0,0.4);">🍽</div>`,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    })

    L.marker([place.lat, place.lng], { icon })
      .addTo(map)
      .bindPopup(`<b>${place.nome}</b><br>${place.endereco}`)
      .openPopup()

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [place])

  if (!place.lat) return null

  return (
    <div
      ref={containerRef}
      className="h-48 w-full rounded-xl overflow-hidden border border-white/10"
    />
  )
}
