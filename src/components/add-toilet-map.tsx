"use client";

import { useEffect, useRef, useState } from "react";
import {
  loadGoogleMapsScript,
  type GoogleMapInstance,
  type GoogleMapMarker,
  type GoogleMapMouseEvent,
} from "@/lib/google-maps";
import type { UserLocation } from "@/lib/toilets";

type PinLocation = {
  lat: number;
  lng: number;
};

export function AddToiletMap({
  userLocation,
  pinLocation,
  onPinChange,
}: {
  userLocation: UserLocation;
  pinLocation: PinLocation | null;
  onPinChange: (location: PinLocation) => void;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<GoogleMapInstance | null>(null);
  const pinMarkerRef = useRef<GoogleMapMarker | null>(null);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">("loading");
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function setupMap() {
      try {
        await loadGoogleMapsScript();

        if (isCancelled || !mapRef.current || !window.google?.maps) {
          return;
        }

        const maps = window.google.maps;
        const map = new maps.Map(mapRef.current, {
          center: { lat: userLocation.lat, lng: userLocation.lng },
          zoom: 16,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
        });

        mapInstanceRef.current = map;

        map.addListener("click", (event: GoogleMapMouseEvent) => {
          if (!event.latLng) {
            return;
          }

          const nextLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };

          if (!pinMarkerRef.current) {
            pinMarkerRef.current = new maps.Marker({
              position: nextLocation,
              map,
              title: "New toilet location",
              draggable: true,
            });
          } else {
            pinMarkerRef.current.setPosition(nextLocation);
            pinMarkerRef.current.setMap(map);
          }

          onPinChange(nextLocation);
        });

        if (pinLocation) {
          pinMarkerRef.current = new maps.Marker({
            position: pinLocation,
            map,
            title: "New toilet location",
            draggable: true,
          });
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
      if (pinMarkerRef.current) {
        pinMarkerRef.current.setMap(null);
        pinMarkerRef.current = null;
      }
      mapInstanceRef.current = null;
    };
  }, [onPinChange, pinLocation, userLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current || !pinLocation) {
      return;
    }

    mapInstanceRef.current.panTo(pinLocation);

    if (pinMarkerRef.current) {
      pinMarkerRef.current.setPosition(pinLocation);
      pinMarkerRef.current.setMap(mapInstanceRef.current);
    }
  }, [pinLocation]);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="relative min-h-[420px] bg-slate-100">
        <div ref={mapRef} className="h-[420px] w-full" />

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

        <div className="absolute inset-x-4 top-4 flex justify-end">
          <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm">
            Tap map to drop a pin
          </div>
        </div>
      </div>
    </div>
  );
}
