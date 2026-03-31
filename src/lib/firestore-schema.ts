import { toiletSeedData } from "@/lib/toilet-seed";
import { firestoreCollections } from "@/lib/toilets";

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
      createdByUserId: "string",
      createdByEmail: "string | null",
      createdAt: "Timestamp",
      updatedAt: "Timestamp",
    },
  },
  reviews: {
    collection: firestoreCollections.reviews,
    documentShape: {
      toiletId: "string",
      toiletName: "string",
      userId: "string",
      userEmail: "string | null",
      rating: "number",
      text: "string",
      photoUrls: ["string"],
      photoCount: "number",
      createdAt: "Timestamp",
      updatedAt: "Timestamp",
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

export const firestoreSeedPreview = toiletSeedData.map((toilet) => ({
  ...toilet,
  searchKeywords: toilet.name.toLowerCase().split(" "),
}));
