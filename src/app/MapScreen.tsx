import { useMemo, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { Building2, Crosshair, List, LocateFixed, Map as MapIcon, Navigation, Search, SlidersHorizontal, X } from 'lucide-react'
import { Badge, Button, Card, IconButton, PageHeader } from './ui'

type Place = { id: number; type: 'donor' | 'hospital'; name: string; blood?: string; available?: boolean; distance: string; position: [number, number]; address?: string }
const places: Place[] = [
  { id: 1, type: 'donor', name: 'Priya S.', blood: 'O+', available: true, distance: '1.2 km', position: [28.6188, 77.2066] },
  { id: 2, type: 'donor', name: 'Rohan M.', blood: 'B+', available: true, distance: '2.7 km', position: [28.626, 77.218] },
  { id: 3, type: 'donor', name: 'Neha K.', blood: 'A+', available: false, distance: '3.8 km', position: [28.609, 77.222] },
  { id: 4, type: 'hospital', name: 'City Care Hospital', distance: '2.1 km', position: [28.616, 77.229], address: 'Connaught Place, New Delhi' },
  { id: 5, type: 'hospital', name: 'LifeLine Blood Bank', distance: '4.3 km', position: [28.632, 77.197], address: 'Karol Bagh, New Delhi' },
]

const donorIcon = (available = true) => L.divIcon({
  className: 'custom-marker',
  html: `<div class="drop-marker ${available ? '' : 'unavailable'}">♥</div>`,
  iconSize: [38, 44], iconAnchor: [19, 40],
})
const hospitalIcon = L.divIcon({ className: 'custom-marker', html: '<div class="hospital-marker">+</div>', iconSize: [38, 38], iconAnchor: [19, 19] })

function MapControls({ onLocate }: { onLocate: () => void }) {
  const map = useMap()
  return <div className="map-controls"><IconButton label="Zoom in" onClick={() => map.zoomIn()}>+</IconButton><IconButton label="Zoom out" onClick={() => map.zoomOut()}>−</IconButton><IconButton label="Use sample current location" onClick={() => { map.flyTo([28.6139, 77.209], 14); onLocate() }}><LocateFixed size={19} /></IconButton></div>
}

function LocationPicker({ onPick }: { onPick: (position: [number, number]) => void }) {
  useMapEvents({ click(event) { onPick([event.latlng.lat, event.latlng.lng]) } })
  return null
}

export default function MapScreen() {
  const [mode, setMode] = useState<'map' | 'list'>('map')
  const [group, setGroup] = useState('All')
  const [distance, setDistance] = useState('5 km')
  const [selected, setSelected] = useState<Place | null>(null)
  const [picked, setPicked] = useState<[number, number] | null>(null)
  const [notice, setNotice] = useState('')
  const filtered = useMemo(() => places.filter((place) => place.type === 'hospital' || group === 'All' || place.blood === group), [group])
  return (
    <div className="map-page">
      <PageHeader title="Nearby care" subtitle="Sample locations · New Delhi" />
      <div className="map-search"><Search size={18} /><input placeholder="Search area, hospital or blood bank" /><SlidersHorizontal size={18} /></div>
      <div className="filter-row">
        {['All', 'O+', 'A+', 'B+'].map((item) => <button key={item} className={group === item ? 'chip active' : 'chip'} onClick={() => setGroup(item)}>{item}</button>)}
        <button className="chip" onClick={() => setDistance(distance === '5 km' ? '10 km' : '5 km')}>{distance}</button>
      </div>
      <div className="map-toggle">
        <button className={mode === 'map' ? 'active' : ''} onClick={() => setMode('map')}><MapIcon size={16} /> Map</button>
        <button className={mode === 'list' ? 'active' : ''} onClick={() => setMode('list')}><List size={16} /> List</button>
      </div>
      {mode === 'map' ? (
        <div className="map-wrap">
          <MapContainer center={[28.6139, 77.209]} zoom={13} zoomControl={false}>
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filtered.map((place) => <Marker key={place.id} position={place.position} icon={place.type === 'donor' ? donorIcon(place.available) : hospitalIcon} eventHandlers={{ click: () => setSelected(place) }} />)}
            {picked && <Marker position={picked} icon={donorIcon(true)} />}
            <LocationPicker onPick={(position) => { setPicked(position); setNotice('Pin moved. Confirm this approximate demo location.') }} />
            <MapControls onLocate={() => setNotice('Centered on the sample app location. Live GPS is not used.')} />
          </MapContainer>
          {notice && <div className="map-notice">{notice}</div>}
          {picked && <Button className="confirm-location" onClick={() => { setNotice('Approximate location saved for this demo.'); setPicked(null) }}>Confirm Location</Button>}
        </div>
      ) : (
        <div className="place-list">
          {filtered.map((place) => (
            <Card key={place.id} className="place-card" onClick={() => setSelected(place)}>
              <div className={place.type === 'donor' ? 'place-icon donor' : 'place-icon'}>{place.type === 'donor' ? place.blood : <Building2 size={20} />}</div>
              <div><strong>{place.name}</strong><span>{place.distance} · {place.type === 'donor' ? (place.available ? 'Available now' : 'Unavailable') : place.address}</span></div>
              <Navigation size={17} />
            </Card>
          ))}
        </div>
      )}
      {selected && <div className="sheet-backdrop" onClick={() => setSelected(null)}><div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber" /><IconButton label="Close" onClick={() => setSelected(null)}><X size={18} /></IconButton>
        {selected.type === 'donor' ? <>
          <div className="donor-head"><div className="blood-orb">{selected.blood}</div><div><h2>{selected.name}</h2><p>Privacy-safe demo donor profile</p></div></div>
          <div className="detail-row"><span>Approximate distance</span><strong>{selected.distance}</strong></div>
          <div className="detail-row"><span>Availability</span><Badge tone={selected.available ? 'green' : 'grey'}>{selected.available ? 'Available' : 'Unavailable'}</Badge></div>
          <div className="disclaimer">Preliminary discovery only. Medical compatibility and donor eligibility must be confirmed by qualified professionals.</div>
          <div className="button-pair"><Button variant="secondary" onClick={() => setNotice('Demo profile opened.')}>View Profile</Button><Button disabled={!selected.available} onClick={() => { setNotice('Demo request sent privately.'); setSelected(null) }}>Send Request</Button></div>
        </> : <>
          <div className="donor-head"><div className="blood-orb facility"><Building2 size={25} /></div><div><h2>{selected.name}</h2><p>Sample healthcare facility</p></div></div>
          <div className="detail-row"><span>Address</span><strong>{selected.address}</strong></div>
          <div className="detail-row"><span>Contact</span><strong>011-4000-2400</strong></div>
          <Button className="full" onClick={() => setNotice('Directions are simulated in this frontend demo.')}><Navigation size={18} /> Directions</Button>
        </>}
      </div></div>}
    </div>
  )
}
