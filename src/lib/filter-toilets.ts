import { getDistanceInKm } from "@/lib/location";
import type { ToiletFilters, ToiletRecord, UserLocation } from "@/lib/toilets";

export type ToiletSearchResult = ToiletRecord & {
  distanceKm: number;
};

export function filterToilets(
  toilets: ToiletRecord[],
  filters: ToiletFilters,
  userLocation: UserLocation,
) {
  return toilets
    .map((toilet) => ({
      ...toilet,
      distanceKm: getDistanceInKm(userLocation, toilet.location),
    }))
    .filter((toilet) => toilet.rating >= filters.minimumRating)
    .filter((toilet) => !filters.wheelchair || toilet.accessibility.includes("wheelchair"))
    .filter(
      (toilet) =>
        !filters.babyChanging || toilet.accessibility.includes("baby-changing"),
    )
    .filter(
      (toilet) =>
        !filters.genderNeutral || toilet.accessibility.includes("gender-neutral"),
    )
    .sort((a, b) => a.distanceKm - b.distanceKm || b.rating - a.rating);
}
