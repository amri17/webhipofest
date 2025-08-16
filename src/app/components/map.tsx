'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L, { LatLngExpression } from 'leaflet'

// Fix default icon agar marker muncul tanpa ESLint error
const DefaultIcon = L.Icon.Default.prototype as unknown as L.Icon.Default & { _getIconUrl?: unknown }
delete DefaultIcon._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function MapComponent() {
  const position: LatLngExpression = [-6.200000, 106.816666] // Jakarta

  return (
    <div className="w-full h-screen p-4">
      <MapContainer 
        center={position} 
        zoom={12} 
        className="h-full w-full rounded-2xl shadow-lg"
      >
        {/* TileLayer versi satelit */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>'
        />
        <Marker position={position}>
          <Popup>Ini Jakarta 🚀</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
