"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { getFirebaseApp } from "@/lib/firebase/client";
import {
  type CreateReviewInput,
  firestoreCollections,
  type CreateToiletInput,
  type ReviewRecord,
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

function isPhotoUrlArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function toDate(value: unknown) {
  return value instanceof Timestamp ? value.toDate() : null;
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

export function getReviewDocId(toiletId: string, userId: string) {
  return `${toiletId}_${userId}`;
}

export function mapFirestoreReview(id: string, data: DocumentData): ReviewRecord | null {
  if (
    typeof data.toiletId !== "string" ||
    typeof data.userId !== "string" ||
    (data.userEmail !== null && typeof data.userEmail !== "string") ||
    typeof data.rating !== "number" ||
    typeof data.text !== "string" ||
    typeof data.photoCount !== "number" ||
    !isPhotoUrlArray(data.photoUrls)
  ) {
    return null;
  }

  return {
    id,
    toiletId: data.toiletId,
    userId: data.userId,
    userEmail: data.userEmail ?? null,
    rating: data.rating,
    text: data.text,
    photoUrls: data.photoUrls,
    photoCount: data.photoCount,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function fetchReviewsByToiletId(toiletId: string) {
  const snapshot = await getDocs(
    query(
      collection(getFirestoreDb(), firestoreCollections.reviews),
      where("toiletId", "==", toiletId),
    ),
  );

  return snapshot.docs
    .map((item) => mapFirestoreReview(item.id, item.data()))
    .filter((item): item is ReviewRecord => item !== null)
    .sort((a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0));
}

export async function fetchReviewsByUserId(userId: string) {
  const snapshot = await getDocs(
    query(
      collection(getFirestoreDb(), firestoreCollections.reviews),
      where("userId", "==", userId),
    ),
  );

  return snapshot.docs
    .map((item) => mapFirestoreReview(item.id, item.data()))
    .filter((item): item is ReviewRecord => item !== null)
    .sort((a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0));
}

export async function fetchToiletsByCreatorId(userId: string) {
  const snapshot = await getDocs(
    query(
      collection(getFirestoreDb(), firestoreCollections.toilets),
      where("createdByUserId", "==", userId),
    ),
  );

  return snapshot.docs
    .map((item) => mapFirestoreToilet(item.id, item.data()))
    .filter((item): item is ToiletRecord => item !== null)
    .sort((a, b) => b.photosCount - a.photosCount || b.reviewCount - a.reviewCount);
}

export async function fetchProfileStats(userId: string) {
  const [reviews, toilets] = await Promise.all([
    fetchReviewsByUserId(userId),
    fetchToiletsByCreatorId(userId),
  ]);

  return {
    reviewCount: reviews.length,
    photoCount: reviews.reduce((total, review) => total + review.photoCount, 0),
    toiletsAddedCount: toilets.length,
  };
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
    rating: 0,
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

export async function createOrUpdateReview(
  toiletId: string,
  input: CreateReviewInput,
  user: { uid: string; email: string | null },
) {
  const db = getFirestoreDb();
  const reviewId = getReviewDocId(toiletId, user.uid);
  const reviewRef = doc(db, firestoreCollections.reviews, reviewId);
  const existingReview = await getDoc(reviewRef);

  const basePayload = {
    toiletId,
    userId: user.uid,
    userEmail: user.email,
    rating: input.rating,
    text: input.text.trim(),
    photoUrls: input.photoUrls,
    photoCount: input.photoUrls.length,
    updatedAt: serverTimestamp(),
  };

  if (existingReview.exists()) {
    await setDoc(reviewRef, basePayload, { merge: true });
  } else {
    await setDoc(reviewRef, {
      ...basePayload,
      createdAt: serverTimestamp(),
    });
  }

  const reviews = await fetchReviewsByToiletId(toiletId);
  const reviewCount = reviews.length;
  const rating =
    reviewCount === 0
      ? 0
      : Number(
          (reviews.reduce((total, review) => total + review.rating, 0) / reviewCount).toFixed(1),
        );
  const photosCount = reviews.reduce((total, review) => total + review.photoCount, 0);

  await updateDoc(doc(db, firestoreCollections.toilets, toiletId), {
    rating,
    reviewCount,
    photosCount,
    updatedAt: serverTimestamp(),
  });

  return reviewId;
}
