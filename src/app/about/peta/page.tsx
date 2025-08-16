import MapComponent from '../../components/map'

export default function PetaPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Peta Page</h1>
      <p className="mb-4">Ini adalah peta menggunakan Leaflet + OpenStreetMap.</p>
      <MapComponent />
    </div>
  )
}
