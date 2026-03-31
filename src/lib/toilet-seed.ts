import type { ToiletRecord } from "@/lib/toilets";

export const toiletSeedData: ToiletRecord[] = [
  {
    id: "piccadilly-gardens",
    name: "Piccadilly Gardens Public Toilets",
    description:
      "Busy city-centre toilets near the tram stop with regular cleaning checks and clear signage.",
    address: "Piccadilly Gardens, Manchester M1 1RG",
    location: { lat: 53.4814, lng: -2.2375 },
    rating: 0,
    reviewCount: 0,
    accessibility: ["wheelchair", "baby-changing"],
    openingHours: "Open daily · 7am to 10pm",
    photosCount: 0,
  },
  {
    id: "central-library",
    name: "Manchester Central Library",
    description:
      "Indoor toilets inside Central Library with step-free access and plenty of space for parents.",
    address: "St Peter's Square, Manchester M2 5PD",
    location: { lat: 53.4787, lng: -2.2447 },
    rating: 0,
    reviewCount: 0,
    accessibility: ["wheelchair", "baby-changing", "gender-neutral"],
    openingHours: "Library hours · closes 8pm",
    photosCount: 0,
  },
  {
    id: "arndale-centre",
    name: "Manchester Arndale",
    description:
      "Reliable shopping-centre facilities close to food court seating and family services.",
    address: "49 High Street, Manchester M4 3AQ",
    location: { lat: 53.4844, lng: -2.2402 },
    rating: 0,
    reviewCount: 0,
    accessibility: ["wheelchair", "baby-changing"],
    openingHours: "Centre hours · closes 9pm",
    photosCount: 0,
  },
  {
    id: "northern-quarter",
    name: "Northern Quarter Community Hub",
    description:
      "Smaller but well-kept option with gender-neutral stalls and quick access from the high street.",
    address: "Stevenson Square, Manchester M1 1DB",
    location: { lat: 53.4838, lng: -2.2349 },
    rating: 0,
    reviewCount: 0,
    accessibility: ["gender-neutral"],
    openingHours: "Mon-Sat · 8am to 6pm",
    photosCount: 0,
  },
  {
    id: "deansgate-station",
    name: "Deansgate Station Facilities",
    description:
      "Transport-hub toilets suited for quick stops, with accessible cubicles and clear directions.",
    address: "Deansgate Station, Manchester M3 4LG",
    location: { lat: 53.474, lng: -2.2501 },
    rating: 0,
    reviewCount: 0,
    accessibility: ["wheelchair"],
    openingHours: "Station hours · early to late",
    photosCount: 0,
  },
];
