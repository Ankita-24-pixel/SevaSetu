import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// FIX: Leaflet has a known bug in React where default pins disappear. This fixes it!
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to smoothly move the map when the user's location changes
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    map.setView([coords.lat, coords.lng]);
  }, [coords, map]);
  return null;
}

export default function ServiceMap({ services, userCoords }) {
  // Default to center of India if no user location is provided yet
  const defaultCenter = [20.5937, 78.9629]; 
  const center = userCoords?.lat ? [userCoords.lat, userCoords.lng] : defaultCenter;
  const zoomLevel = userCoords?.lat ? 13 : 5;

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 z-0">
      <MapContainer 
        center={center} 
        zoom={zoomLevel} 
        scrollWheelZoom={false} 
        className="w-full h-full"
      >
        {/* This is the visual map background (OpenStreetMap) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* If we have the user's location, draw a circle or special pin for them */}
        {userCoords?.lat && (
          <Marker position={[userCoords.lat, userCoords.lng]}>
            <Popup>
              <div className="font-bold text-blue-600">You are here!</div>
            </Popup>
          </Marker>
        )}

        <RecenterMap coords={userCoords?.lat ? userCoords : { lat: defaultCenter[0], lng: defaultCenter[1] }} />

        {/* Loop through your MongoDB data and drop a pin for every service! */}
        {services.map((service) => (
          <Marker 
            key={service.id} 
            position={[service.location.coordinates[1], service.location.coordinates[0]]} // Note: Leaflet requires [Lat, Lng], which is opposite of MongoDB!
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-slate-900">{service.name}</h3>
                <p className="mb-2 text-xs text-slate-500">{service.category}</p>
                <p className="text-sm text-slate-700">{service.address}</p>
                <div className="inline-block px-2 py-1 mt-2 text-xs font-semibold text-blue-600 rounded bg-blue-50">
                  {service.distance} away
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}