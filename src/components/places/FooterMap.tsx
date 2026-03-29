import { useEffect, useRef } from 'react'
import L from 'leaflet'
import type { Place } from '@/types/place'

interface FooterMapProps {
  places: Place[]
  onSelect: (place: Place) => void
}

export function FooterMap({ places, onSelect }: FooterMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  // Initialise map once
  useEffect(() => {
    if (!containerRef.current) return

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([-23.558, -46.685], 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current = []
    }
  }, [])

  // Update markers whenever places change
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Remove old markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    const located = places.filter((p) => p.lat && p.lng)
    if (located.length === 0) return

    const icon = L.divIcon({
      html: `<div style="background:#72b11e;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 2px 8px rgba(0,0,0,0.5);">🍽</div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })

    const newMarkers = located.map((place) => {
      const popupContent = `
        <div style="min-width:150px;font-family:sans-serif">
          <b style="font-size:13px;display:block;margin-bottom:4px">${place.nome}</b>
          <span style="font-size:11px;color:#666;display:block;margin-bottom:8px">${place.endereco}</span>
          <button
            data-slug="${place.slug}"
            style="background:#72b11e;color:white;border:none;border-radius:6px;padding:5px 10px;font-size:12px;cursor:pointer;width:100%"
          >Ver detalhes</button>
        </div>`

      const marker = L.marker([place.lat!, place.lng!], { icon })
        .addTo(map)
        .bindPopup(popupContent, { maxWidth: 240 })

      // First click opens popup; button inside popup triggers modal
      marker.on('popupopen', () => {
        const btn = marker.getPopup()?.getElement()?.querySelector<HTMLButtonElement>(`[data-slug="${place.slug}"]`)
        if (btn) {
          btn.addEventListener('click', () => {
            onSelectRef.current(place)
          }, { once: true })
        }
      })

      return marker
    })

    markersRef.current = newMarkers

    // Fit map to all markers
    const group = L.featureGroup(newMarkers)
    map.fitBounds(group.getBounds().pad(0.15), { maxZoom: 16 })
  }, [places])

  return (
    <footer className="border-t border-white/10 bg-dark-800">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/40">
          Mapa dos estabelecimentos
        </h2>
      </div>
      <div
        ref={containerRef}
        className="h-[420px] w-full"
      />
    </footer>
  )
}
