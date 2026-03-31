"use client";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirebaseApp } from "@/lib/firebase/client";

export function getFirebaseStorage() {
  return getStorage(getFirebaseApp());
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-z0-9.\-_]/gi, "-").toLowerCase();
}

export async function uploadReviewPhotos({
  toiletId,
  userId,
  reviewId,
  files,
}: {
  toiletId: string;
  userId: string;
  reviewId: string;
  files: File[];
}) {
  const storage = getFirebaseStorage();

  return Promise.all(
    files.map(async (file, index) => {
      const safeName = sanitizeFileName(file.name);
      const storageRef = ref(
        storage,
        `reviews/${userId}/${toiletId}/${reviewId}/${Date.now()}-${index}-${safeName}`,
      );

      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    }),
  );
}
