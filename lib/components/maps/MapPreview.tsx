'use client';

import { useEffect, useRef } from 'react';

interface MapPreviewProps {
  latitude: number;
  longitude: number;
  title?: string;
  className?: string;
}

export function MapPreview({ latitude, longitude, title, className = '' }: MapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || typeof window === 'undefined') return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const map = L.map(mapRef.current!, {
        center: [latitude, longitude],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      L.marker([latitude, longitude], { icon: defaultIcon })
        .addTo(map)
        .bindPopup(title || 'Event Location')
        .openPopup();

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, title]);

  return (
    <div className={`w-full h-64 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
