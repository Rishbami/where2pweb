"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AddToiletFab } from "@/components/add-toilet-fab";
import type { ToiletSearchResult } from "@/lib/filter-toilets";
import { formatDistance } from "@/lib/location";
import {
  loadGoogleMapsScript,
  type GoogleMapInstance,
  type GoogleMapMarker,
} from "@/lib/google-maps";
import type { UserLocation } from "@/lib/toilets";

export function MapPreview({
  toilets,
  userLocation,
  activeToiletId,
}: {
  toilets: ToiletSearchResult[];
  userLocation: UserLocation;
  activeToiletId?: string;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<GoogleMapMarker[]>([]);
  const userMarkerRef = useRef<GoogleMapMarker | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">("loading");
  const [mapError, setMapError] = useState<string | null>(null);

  const selectedToiletId = selectedMarkerId ?? activeToiletId ?? toilets[0]?.id ?? null;

  useEffect(() => {
    let isCancelled = false;
    let map: GoogleMapInstance;

    async function setupMap() {
      try {
        await loadGoogleMapsScript();

        if (isCancelled || !mapRef.current || !window.google?.maps) {
          return;
        }

        const maps = window.google.maps;
        map = new maps.Map(mapRef.current, {
          center: { lat: userLocation.lat, lng: userLocation.lng },
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
        });

        const bounds = new maps.LatLngBounds();
        bounds.extend({ lat: userLocation.lat, lng: userLocation.lng });

        if (userMarkerRef.current) {
          userMarkerRef.current.setMap(null);
        }

        userMarkerRef.current = new maps.Marker({
          position: { lat: userLocation.lat, lng: userLocation.lng },
          map,
          title: userLocation.label,
          icon: {
            path: maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#2563eb",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
        });

        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = toilets.map((toilet) => {
          bounds.extend({ lat: toilet.location.lat, lng: toilet.location.lng });

          const marker = new maps.Marker({
            position: {
              lat: toilet.location.lat,
              lng: toilet.location.lng,
            },
            map,
            title: toilet.name,
          });

          marker.addListener("click", () => {
            setSelectedMarkerId(toilet.id);
            map.panTo({ lat: toilet.location.lat, lng: toilet.location.lng });
          });

          return marker;
        });

        if (toilets.length > 0) {
          map.fitBounds(bounds, 56);
        }

        if (!isCancelled) {
          setMapStatus("ready");
          setMapError(null);
        }
      } catch (error) {
        if (!isCancelled) {
          setMapStatus("error");
          setMapError(
            error instanceof Error ? error.message : "Google Maps failed to load.",
          );
        }
      }
    }

    void setupMap();

    return () => {
      isCancelled = true;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
        userMarkerRef.current = null;
      }
    };
  }, [toilets, userLocation]);

  const selectedToilet =
    toilets.find((toilet) => toilet.id === selectedToiletId) ?? toilets[0] ?? null;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="relative min-h-[360px] bg-slate-100">
        <div ref={mapRef} className="h-[360px] w-full" />

        {mapStatus === "loading" ? (
          <div className="absolute inset-x-4 top-4 rounded-full bg-white/95 px-4 py-2 text-sm text-slate-600 shadow-sm">
            Loading Google Maps...
          </div>
        ) : null}

        {mapStatus === "error" ? (
          <div className="absolute inset-x-4 top-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm">
            {mapError}
          </div>
        ) : null}

        <AddToiletFab />
      </div>

      <div className="border-t border-slate-200 p-4">
        {selectedToilet ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Selected on map
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-950">
                {selectedToilet.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {formatDistance(selectedToilet.distanceKm)} away from {userLocation.label}
              </p>
            </div>

            <Link
              href={`/toilets/${selectedToilet.id}`}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Open details
            </Link>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No toilets match the current filters.
          </p>
        )}
      </div>
    </div>
  );
}
