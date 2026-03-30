import { firestoreCollections, getFirestoreToiletSeed } from "@/lib/toilets";

export const firestoreStructure = {
  toilets: {
    collection: firestoreCollections.toilets,
    documentShape: {
      id: "string",
      name: "string",
      description: "string",
      address: "string",
      location: {
        lat: "number",
        lng: "number",
      },
      rating: "number",
      reviewCount: "number",
      accessibility: ["wheelchair | baby-changing | gender-neutral"],
      openingHours: "string",
      photosCount: "number",
      searchKeywords: ["string"],
      createdAt: "Timestamp",
      updatedAt: "Timestamp",
    },
  },
  reviews: {
    collection: firestoreCollections.reviews,
    documentShape: {
      toiletId: "string",
      userId: "string",
      rating: "number",
      text: "string",
      createdAt: "Timestamp",
    },
  },
  users: {
    collection: firestoreCollections.users,
    documentShape: {
      displayName: "string",
      avatarUrl: "string | null",
      homeCity: "string | null",
      createdAt: "Timestamp",
    },
  },
} as const;

export const firestoreSeedPreview = getFirestoreToiletSeed();
