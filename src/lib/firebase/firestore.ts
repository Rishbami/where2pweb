"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore/lite";
import { getFirebaseApp } from "@/lib/firebase/client";
import {
  firestoreCollections,
  type CreateToiletInput,
  type ToiletRecord,
} from "@/lib/toilets";

export function getFirestoreDb() {
  return getFirestore(getFirebaseApp());
}

function isAccessibilityArray(value: unknown): value is ToiletRecord["accessibility"] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item === "wheelchair" ||
        item === "baby-changing" ||
        item === "gender-neutral",
    )
  );
}

export function mapFirestoreToilet(
  id: string,
  data: DocumentData,
): ToiletRecord | null {
  const location = data.location;

  if (
    typeof data.name !== "string" ||
    typeof data.description !== "string" ||
    typeof data.address !== "string" ||
    typeof data.rating !== "number" ||
    typeof data.reviewCount !== "number" ||
    !isAccessibilityArray(data.accessibility) ||
    typeof data.openingHours !== "string" ||
    typeof data.photosCount !== "number" ||
    typeof location?.lat !== "number" ||
    typeof location?.lng !== "number"
  ) {
    return null;
  }

  return {
    id,
    name: data.name,
    description: data.description,
    address: data.address,
    rating: data.rating,
    reviewCount: data.reviewCount,
    accessibility: data.accessibility,
    openingHours: data.openingHours,
    photosCount: data.photosCount,
    location: {
      lat: location.lat,
      lng: location.lng,
    },
  };
}

export async function fetchToilets() {
  const snapshot = await getDocs(collection(getFirestoreDb(), firestoreCollections.toilets));

  return snapshot.docs
    .map((item) => mapFirestoreToilet(item.id, item.data()))
    .filter((item): item is ToiletRecord => item !== null);
}

export async function fetchToiletById(id: string) {
  const snapshot = await getDoc(doc(getFirestoreDb(), firestoreCollections.toilets, id));

  if (!snapshot.exists()) {
    return null;
  }

  return mapFirestoreToilet(snapshot.id, snapshot.data());
}

function buildSearchKeywords(input: CreateToiletInput) {
  return [
    input.name,
    input.address,
    input.description,
    ...input.accessibility,
  ]
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter(Boolean);
}

export async function createToilet(
  input: CreateToiletInput,
  user: { uid: string; email: string | null },
) {
  const payload = {
    name: input.name.trim(),
    description: input.description.trim(),
    address: input.address.trim(),
    openingHours: input.openingHours.trim(),
    location: {
      lat: input.location.lat,
      lng: input.location.lng,
    },
    accessibility: input.accessibility,
    rating: 3,
    reviewCount: 0,
    photosCount: 0,
    searchKeywords: buildSearchKeywords(input),
    createdByUserId: user.uid,
    createdByEmail: user.email,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(getFirestoreDb(), firestoreCollections.toilets), payload);

  return docRef.id;
}
