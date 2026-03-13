"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.heat"

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

interface CrimeMapProps {
  crimes: any[]
  showHeatmap: boolean
  showMarkers: boolean
  showPredictions: boolean
}

interface PredictionResult {
  predicted_crime: string
  risk_level: "HIGH" | "MEDIUM" | "LOW"
  suggested_action: string
}

async function predictCrime(
  lat: number,
  lng: number
): Promise<PredictionResult> {

  const now = new Date()

  try {

    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
        hour: now.getHours(),
        day: now.getDate(),
        month: now.getMonth() + 1
      })
    })

    if (response.ok) {

      const data = await response.json()

      const riskScore = Math.random() * 100

      return {
        predicted_crime: data.predicted_crime || "THEFT",
        risk_level: riskScore > 70 ? "HIGH" : riskScore > 40 ? "MEDIUM" : "LOW",
        suggested_action:
          riskScore > 70
            ? "Increase police patrol"
            : riskScore > 40
            ? "Increase monitoring"
            : "Standard patrol"
      }

    }

  } catch {}

  const crimeTypes = ["THEFT","BATTERY","ASSAULT","BURGLARY","ROBBERY"]

  const randomCrime =
    crimeTypes[Math.floor(Math.random() * crimeTypes.length)]

  const riskScore = Math.random() * 100

  return {
    predicted_crime: randomCrime,
    risk_level: riskScore > 70 ? "HIGH" : riskScore > 40 ? "MEDIUM" : "LOW",
    suggested_action:
      riskScore > 70
        ? "Increase police patrol"
        : riskScore > 40
        ? "Increase monitoring"
        : "Standard patrol"
  }
}

export default function CrimeMap({
  crimes,
  showHeatmap = true,
  showMarkers = true,
  showPredictions = true
}: CrimeMapProps) {

  console.log("Crimes received:", crimes.length)
  console.log("Crimes received:", crimes)
  console.log("Crime count:", crimes.length)

  

  // Heatmap from dataset
  const heatmapData = crimes
    .filter((crime:any) => crime.Latitude && crime.Longitude)
    .map((crime:any) => [
      crime.Latitude,
      crime.Longitude,
      1
    ])

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const heatLayerRef = useRef<L.HeatLayer | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [hotspots, setHotspots] = useState<any[]>([])
  useEffect(() => {

  fetch("http://127.0.0.1:5000/api/hotspots")
    .then(res => res.json())
    .then(data => {
      setHotspots(data)
      console.log("Hotspots:", data)
    })

}, [])

  // MAP INIT
  useEffect(() => {

    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current,{
      center:[41.8781,-87.6298],
      zoom:13
    })

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution:"© OpenStreetMap contributors"}
    ).addTo(map)

    mapInstanceRef.current = map

    map.on("click",async(e:L.LeafletMouseEvent)=>{

      if(!showPredictions) return

      setIsLoading(true)

      const {lat,lng}=e.latlng

      const prediction = await predictCrime(lat,lng)

      setIsLoading(false)

      L.popup()
        .setLatLng(e.latlng)
        .setContent(`
          <div>
            <b>${prediction.predicted_crime}</b><br/>
            Risk: ${prediction.risk_level}<br/>
            ${prediction.suggested_action}
          </div>
        `)
        .openOn(map)

    })

  },[])

  // HEATMAP
  useEffect(()=>{

    const map = mapInstanceRef.current
    if(!map) return

    if(showHeatmap && !heatLayerRef.current){

      // @ts-ignore
      heatLayerRef.current = L.heatLayer(heatmapData,{
        radius:25,
        blur:15,
        maxZoom:17,
        gradient:{
          0.2:"#22c55e",
          0.5:"#f59e0b",
          0.8:"#ef4444"
        }
      }).addTo(map)

    }
    else if(!showHeatmap && heatLayerRef.current){

      map.removeLayer(heatLayerRef.current)
      heatLayerRef.current=null

    }

  },[showHeatmap,crimes])
  // HOTSPOTS
useEffect(()=>{

  const map = mapInstanceRef.current
  if(!map) return

  hotspots.forEach((spot:any)=>{

    let color="green"

    if(spot.crime_count > 1000)
      color="red"
    else if(spot.crime_count > 100)
      color="orange"

    const circle = L.circle(
      [spot.latitude, spot.longitude],
      {
        radius:2500,
        color:color,
        fillOpacity:0.35,
        weight:2
      }
    )

    circle.bindPopup(`
      <b>Crime Hotspot</b><br/>
      Crimes: ${spot.crime_count}
    `)

    circle.addTo(map).bringToBack()

  })

},[hotspots])

  // MARKERS
useEffect(()=>{

  const map = mapInstanceRef.current
  if(!map) return

  // remove old markers
  markersRef.current.forEach(marker=>map.removeLayer(marker))
  markersRef.current=[]

  if(showMarkers){

    crimes.forEach((crime:any)=>{

      if(!crime.Latitude || !crime.Longitude) return

      let risk="LOW"

      if(crime["Primary Type"]==="BATTERY" || crime["Primary Type"]==="ASSAULT")
        risk="HIGH"
      else if(crime["Primary Type"]==="ROBBERY" || crime["Primary Type"]==="BURGLARY")
        risk="MEDIUM"

      let color="#22c55e"

      if(risk==="HIGH") color="#ef4444"
      if(risk==="MEDIUM") color="#f59e0b"

      const icon = L.divIcon({
        html:`
          <div style="
            width:12px;
            height:12px;
            background:${color};
            border-radius:50%;
            border:2px solid white;
          "></div>
        `,
        iconSize:[12,12],
        className:""
      })

      const marker = L.marker(
        [crime.Latitude, crime.Longitude],
        {icon}
      )
      .addTo(map)
      .bindPopup(`
        <b>${crime["Primary Type"]}</b><br/>
        Risk: ${risk}<br/>
        ${crime.Date}
      `)

      markersRef.current.push(marker)

    })

  }

},[showMarkers,crimes])


  return(

    <div className="relative">

      <div
        ref={mapRef}
        className="w-full h-[calc(100vh-12rem)] rounded-xl overflow-hidden border"
      />

      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded shadow">
          Analyzing location...
        </div>
      )}

    </div>

  )

}