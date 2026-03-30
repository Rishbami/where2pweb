export type AccessibilityFeature =
  | "wheelchair"
  | "baby-changing"
  | "gender-neutral";

export type ToiletRecord = {
  id: string;
  name: string;
  description: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  accessibility: AccessibilityFeature[];
  openingHours: string;
  photosCount: number;
};

export type ToiletFilters = {
  minimumRating: number;
  wheelchair: boolean;
  babyChanging: boolean;
  genderNeutral: boolean;
};

export type UserLocation = {
  lat: number;
  lng: number;
  label: string;
};

export const defaultUserLocation: UserLocation = {
  lat: 53.4808,
  lng: -2.2426,
  label: "Manchester city centre",
};

export const firestoreCollections = {
  toilets: "toilets",
  reviews: "reviews",
  users: "users",
} as const;
