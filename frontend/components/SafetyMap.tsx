"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

export default function SafetyMap() {

  const position: [number, number] = [13.0827, 80.2707] // Chennai example

  return (

    <div className="space-y-6">

      {/* Leaflet Safety Map */}

      <div className="h-[400px] w-full rounded-xl overflow-hidden border">

        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position}>
            <Popup>
              Crime Monitoring Area
            </Popup>
          </Marker>

        </MapContainer>

      </div>

      {/* Google Map View */}

      <div className="h-[500px] w-full rounded-xl overflow-hidden border">

        <iframe
          src="https://www.google.com/maps?q=13.0827,80.2707&z=13&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
        />

      </div>

    </div>
  )
}
