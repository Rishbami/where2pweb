"use client";

let googleMapsPromise: Promise<void> | null = null;

export type GoogleMapMarker = {
  setMap: (map: GoogleMapInstance | null) => void;
  addListener: (eventName: string, handler: () => void) => void;
};

export type GoogleMapInstance = {
  panTo: (position: { lat: number; lng: number }) => void;
  fitBounds: (bounds: GoogleLatLngBounds, padding?: number) => void;
};

export type GoogleLatLngBounds = {
  extend: (position: { lat: number; lng: number }) => void;
};

type GoogleMapsRuntime = {
  Map: new (
    element: HTMLElement,
    options: {
      center: { lat: number; lng: number };
      zoom: number;
      disableDefaultUI: boolean;
      zoomControl: boolean;
      mapTypeControl: boolean;
      streetViewControl: boolean;
      fullscreenControl: boolean;
      clickableIcons: boolean;
    },
  ) => GoogleMapInstance;
  Marker: new (options: {
    position: { lat: number; lng: number };
    map: GoogleMapInstance;
    title: string;
    icon?: {
      path: string | number;
      scale: number;
      fillColor: string;
      fillOpacity: number;
      strokeColor: string;
      strokeWeight: number;
    };
  }) => GoogleMapMarker;
  LatLngBounds: new () => GoogleLatLngBounds;
  SymbolPath: {
    CIRCLE: string | number;
  };
};

export function loadGoogleMapsScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser."));
  }

  if (window.google?.maps) {
    return Promise.resolve();
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return Promise.reject(
      new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in the local environment."),
    );
  }

  googleMapsPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-google-maps="where2p"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Google Maps failed to load.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "where2p";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps failed to load."));
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

declare global {
  interface Window {
    google?: {
      maps: GoogleMapsRuntime;
    };
  }
}
