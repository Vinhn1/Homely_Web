import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon issue in React-Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Custom Price Pin Component ---
const createPriceIcon = (price, isActive) => {
  const priceInMillions = (price / 1000000).toFixed(1);
  return L.divIcon({
    html: `
      <div class="bg-${isActive ? 'blue-800 scale-125 z-[1000]' : 'blue-600'} text-white px-2 py-1 rounded-lg font-bold text-[11px] shadow-lg border-2 border-white whitespace-nowrap transition-all flex items-center gap-1 group">
         ${priceInMillions}tr
      </div>
    `,
    className: "custom-price-pin",
    iconSize: [40, 24],
    iconAnchor: [20, 12],
  });
};

// Component to handle Map Re-centering
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    // Chỉ flyTo nếu center là mảng có 2 phần tử số hợp lệ
    if (center && Array.isArray(center) && 
        Number.isFinite(center[0]) && Number.isFinite(center[1])) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

const PropertyMap = ({ properties, onMarkerClick, activeId }) => {
  // Default to center of Vĩnh Long
  const defaultCenter = [10.2533, 105.9722];
  
  // Defensive check for center
  const getCenter = () => {
    if (properties && properties.length > 0) {
      const firstWithCoords = properties.find(p => {
        const lat = parseFloat(p.location?.coordinates?.lat);
        const lng = parseFloat(p.location?.coordinates?.lng);
        return Number.isFinite(lat) && Number.isFinite(lng);
      });

      if (firstWithCoords) {
        return [
          parseFloat(firstWithCoords.location.coordinates.lat),
          parseFloat(firstWithCoords.location.coordinates.lng)
        ];
      }
    }
    return defaultCenter;
  };

  const center = getCenter();
  const isValidCenter = center && Number.isFinite(center[0]) && Number.isFinite(center[1]);
  const safeCenter = isValidCenter ? center : defaultCenter;

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-inner border-4 border-white relative bg-slate-100">
      <MapContainer
        key={`${safeCenter[0]}-${safeCenter[1]}`} // Force re-render if center changes
        center={safeCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeView center={safeCenter} zoom={13} />

        {properties.map((property) => {
          const lat = parseFloat(property.location?.coordinates?.lat);
          const lng = parseFloat(property.location?.coordinates?.lng);
          
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

          const isActive = activeId === property._id;
          
          return (
            <Marker
              key={property._id}
              position={[lat, lng]}
              icon={createPriceIcon(property.price, isActive)}
              eventHandlers={{
                click: () => onMarkerClick(property._id),
              }}
            >
              <Popup className="custom-popup">
                <div className="w-48 p-1">
                  <img
                    src={property.images?.[0] || "https://placehold.co/400x300?text=Homely"}
                    alt={property.title}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{property.title}</h4>
                  <p className="text-blue-600 font-extrabold text-xs">{(property.price / 1000000).toLocaleString()}tr / tháng</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
