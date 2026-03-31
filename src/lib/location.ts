import { defaultUserLocation, type ToiletRecord, type UserLocation } from "@/lib/toilets";

const metresPerKilometre = 1000;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function getDistanceInKm(a: UserLocation, b: ToiletRecord["location"]) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const haversine =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function formatDistance(distanceKm: number) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * metresPerKilometre)} m`;
  }

  return `${distanceKm.toFixed(1)} km`;
}

export function getManualLocation(query: string): UserLocation {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return defaultUserLocation;
  }

  return {
    ...defaultUserLocation,
    label: trimmedQuery,
  };
}
