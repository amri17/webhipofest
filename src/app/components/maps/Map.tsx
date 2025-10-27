'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

// Fix marker icons
const createIcon = () => L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface MapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function Map({ 
  center = [-6.2088, 106.8456], 
  zoom = 13,
  height = '500px'
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Pastikan hanya di client-side
    if (typeof window === 'undefined') return;

    // Set default icon
    L.Marker.prototype.options.icon = createIcon();

    return () => {
      // Cleanup
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div style={{ height }} className="w-full relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={center}>
          <Popup>Lokasi Anda</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}