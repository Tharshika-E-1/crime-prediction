"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface RouteOption {
  id: string
  name: string
  type: "safest" | "balanced" | "fastest"
  distance: string
  duration: string
  safetyScore: number
  dangerZones: number
}

interface SafeRouteMapProps {
  selectedRoute: string | null
  routes: RouteOption[]
  nightMode?: boolean
}

// Mock route coordinates
const routeCoordinates = {
  safest: [
    [41.8781, -87.6298],
    [41.8795, -87.6285],
    [41.8812, -87.6270],
    [41.8830, -87.6255],
    [41.8850, -87.6240],
    [41.8870, -87.6225],
    [41.8890, -87.6210],
    [41.8910, -87.6195],
    [41.8930, -87.6180],
    [41.8950, -87.6165],
  ],
  balanced: [
    [41.8781, -87.6298],
    [41.8790, -87.6275],
    [41.8810, -87.6250],
    [41.8835, -87.6220],
    [41.8860, -87.6195],
    [41.8890, -87.6175],
    [41.8920, -87.6160],
    [41.8950, -87.6165],
  ],
  fastest: [
    [41.8781, -87.6298],
    [41.8800, -87.6260],
    [41.8830, -87.6220],
    [41.8870, -87.6185],
    [41.8910, -87.6165],
    [41.8950, -87.6165],
  ]
}

// Danger zones for visualization
const dangerZones = [
  { center: [41.8820, -87.6240], radius: 100 },
  { center: [41.8855, -87.6205], radius: 80 },
  { center: [41.8875, -87.6195], radius: 120 },
  { center: [41.8895, -87.6180], radius: 90 },
  { center: [41.8835, -87.6225], radius: 70 },
]

export default function SafeRouteMap({ selectedRoute, routes, nightMode }: SafeRouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const routeLinesRef = useRef<L.Polyline[]>([])
  const dangerCirclesRef = useRef<L.Circle[]>([])
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [41.8865, -87.6230],
      zoom: 15,
      zoomControl: true,
    })

    // Add tile layer
    const tileUrl = nightMode 
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    
    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update tile layer for night mode
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer)
      }
    })

    const tileUrl = nightMode 
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    
    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
  }, [nightMode])

  // Draw routes when available
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Clear existing routes
    routeLinesRef.current.forEach(line => map.removeLayer(line))
    routeLinesRef.current = []
    markersRef.current.forEach(marker => map.removeLayer(marker))
    markersRef.current = []

    if (routes.length === 0) return

    const getRouteColor = (type: string) => {
      switch (type) {
        case "safest": return "#22c55e"
        case "balanced": return "#f59e0b"
        case "fastest": return "#ef4444"
        default: return "#0ea5e9"
      }
    }

    // Draw all routes
    routes.forEach((route) => {
      const coords = routeCoordinates[route.type] as [number, number][]
      const isSelected = route.id === selectedRoute
      
      const polyline = L.polyline(coords, {
        color: getRouteColor(route.type),
        weight: isSelected ? 6 : 3,
        opacity: isSelected ? 1 : 0.5,
        dashArray: isSelected ? undefined : "5, 10"
      }).addTo(map)
      
      routeLinesRef.current.push(polyline)
    })

    // Add start and end markers
    const startCoords = routeCoordinates.safest[0] as [number, number]
    const endCoords = routeCoordinates.safest[routeCoordinates.safest.length - 1] as [number, number]

    const startIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: #0ea5e9;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <circle cx="12" cy="12" r="8"/>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })

    const endIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: #22c55e;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    })

    const startMarker = L.marker(startCoords, { icon: startIcon })
      .bindPopup("<strong>Start Location</strong>")
      .addTo(map)
    
    const endMarker = L.marker(endCoords, { icon: endIcon })
      .bindPopup("<strong>Destination</strong>")
      .addTo(map)

    markersRef.current.push(startMarker, endMarker)

    // Fit map to show all routes
    const allCoords = Object.values(routeCoordinates).flat()
    const bounds = L.latLngBounds(allCoords as [number, number][])
    map.fitBounds(bounds, { padding: [50, 50] })

  }, [routes, selectedRoute])

  // Draw danger zones
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Clear existing danger circles
    dangerCirclesRef.current.forEach(circle => map.removeLayer(circle))
    dangerCirclesRef.current = []

    if (routes.length === 0) return

    // Add danger zone circles
    dangerZones.forEach((zone) => {
      const circle = L.circle(zone.center as [number, number], {
        color: "#ef4444",
        fillColor: "#ef4444",
        fillOpacity: 0.2,
        radius: zone.radius,
        weight: 2,
        dashArray: "5, 5"
      }).addTo(map)

      circle.bindPopup(`
        <div style="font-family: system-ui, sans-serif; padding: 4px;">
          <div style="font-weight: 600; color: #ef4444; margin-bottom: 4px;">Danger Zone</div>
          <div style="color: #64748b; font-size: 12px;">High crime activity area</div>
        </div>
      `)

      dangerCirclesRef.current.push(circle)
    })
  }, [routes])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border border-border"
    />
  )
}
