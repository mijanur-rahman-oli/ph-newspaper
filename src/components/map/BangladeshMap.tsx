'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BANGLADESH_DISTRICTS } from '../../lib/data/districts';
import { MapPin } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DistrictNewsCount {
  district: string;
  count: number;
  coordinates: [number, number];
}

interface BangladeshMapProps {
  districtData: DistrictNewsCount[];
  onDistrictClick: (district: string) => void;
}

// Component to handle map fly-to animation
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
    });
  }, [center, zoom, map]);
  
  return null;
}

export default function BangladeshMap({ districtData, onDistrictClick }: BangladeshMapProps) {
  const [mounted, setMounted] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.6850, 90.3563]);
  const [mapZoom, setMapZoom] = useState(7);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDistrictClick = (district: string, coordinates: [number, number]) => {
    setMapCenter(coordinates);
    setMapZoom(10);
    onDistrictClick(district);
  };

  const handleResetView = () => {
    setMapCenter([23.6850, 90.3563]);
    setMapZoom(7);
  };

  // Create custom icon based on news count
  const createCustomIcon = (count: number) => {
    const size = Math.min(40, 20 + Math.log(count + 1) * 5);
    const color = count > 5 ? '#ef4444' : count > 2 ? '#f59e0b' : '#3b82f6';
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${Math.max(10, size * 0.4)}px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          ${count}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <MapContainer
        center={[23.6850, 90.3563]}
        zoom={7}
        style={{ height: '600px', width: '100%' }}
        className="rounded-lg shadow-lg z-0"
      >
        <MapController center={mapCenter} zoom={mapZoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {districtData.map((district) => (
          <Marker
            key={district.district}
            position={district.coordinates}
            icon={createCustomIcon(district.count)}
            eventHandlers={{
              click: () => handleDistrictClick(district.district, district.coordinates),
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg">{district.district}</h3>
                <p className="text-sm text-gray-600">
                  {district.count} news {district.count === 1 ? 'article' : 'articles'}
                </p>
                <button
                  onClick={() => onDistrictClick(district.district)}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All News →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Reset View Button */}
      <button
        onClick={handleResetView}
        className="absolute top-4 right-4 z-[1000] bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
      >
        Reset View
      </button>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white p-4 rounded-lg shadow-md">
        <h4 className="font-semibold mb-2 text-sm">News Count</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>1-2 articles</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span>3-5 articles</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>6+ articles</span>
          </div>
        </div>
      </div>
    </div>
  );
}