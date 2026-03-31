"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  createOrUpdateReview,
  fetchToiletById,
  getReviewDocId,
} from "@/lib/firebase/firestore";
import { uploadReviewPhotos } from "@/lib/firebase/storage";
import type { ToiletRecord } from "@/lib/toilets";

const maxStars = 5;

export function ReviewPage({ id }: { id: string }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [toilet, setToilet] = useState<ToiletRecord | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found" | "error">(
    "loading",
  );
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadToilet() {
      try {
        const nextToilet = await fetchToiletById(id);

        if (isCancelled) {
          return;
        }

        if (!nextToilet) {
          setStatus("not-found");
          return;
        }

        setToilet(nextToilet);
        setStatus("ready");
      } catch {
        if (!isCancelled) {
          setStatus("error");
        }
      }
    }

    void loadToilet();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  const photoPreviews = useMemo(
    () =>
      selectedPhotos.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    [selectedPhotos],
  );

  useEffect(() => {
    return () => {
      photoPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [photoPreviews]);

  function handlePhotoSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setSelectedPhotos((currentFiles) => [...currentFiles, ...files]);
    event.target.value = "";
  }

  function removeSelectedPhoto(indexToRemove: number) {
    setSelectedPhotos((currentFiles) =>
      currentFiles.filter((_, index) => index !== indexToRemove),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !toilet || rating < 1 || reviewText.trim().length < 10) {
      return;
    }

    try {
      setSubmitState("saving");
      setSubmitError(null);

      const reviewId = getReviewDocId(toilet.id, user.uid);
      const photoUrls = await uploadReviewPhotos({
        toiletId: toilet.id,
        userId: user.uid,
        reviewId,
        files: selectedPhotos,
      });

      await createOrUpdateReview(
        toilet.id,
        {
          toiletName: toilet.name,
          rating,
          text: reviewText,
          photoUrls,
        },
        { uid: user.uid, email: user.email },
      );

      router.push(`/toilets/${toilet.id}`);
      router.refresh();
    } catch (error) {
      setSubmitState("error");
      setSubmitError(
        error instanceof Error ? error.message : "We could not save your review yet.",
      );
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Link href={`/toilets/${id}`} className="text-sm font-medium text-slate-500">
          ← Back to details
        </Link>
        <section className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-slate-500">Loading review form...</p>
        </section>
      </main>
    );
  }

  if (status === "not-found" || status === "error" || !toilet) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/search" className="text-sm font-medium text-slate-500">
          ← Back to results
        </Link>
        <section className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-slate-500">
            {status === "not-found"
              ? "This toilet could not be found."
              : "We hit a problem loading this review form."}
          </p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Link href={`/toilets/${id}`} className="text-sm font-medium text-slate-500">
          ← Back to details
        </Link>
        <section className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Leave review
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
            Log in to review {toilet.name}.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Reviews are tied to your account so we can show your activity and
            keep each review linked to the right user.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Log in or sign up
            </Link>
            <Link
              href={`/toilets/${id}`}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Back to details
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Link href={`/toilets/${id}`} className="text-sm font-medium text-slate-500">
        ← Back to details
      </Link>

      <section className="grid gap-8 rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Leave review
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
            Review {toilet.name}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Add a rating, describe the experience, and attach any helpful photos.
          </p>

          <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">How clean was it?</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {Array.from({ length: maxStars }, (_, index) => {
                const starValue = index + 1;
                const isActive = starValue <= rating;

                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border text-2xl transition ${
                      isActive
                        ? "border-amber-300 bg-amber-50 text-amber-500"
                        : "border-slate-200 bg-white text-slate-300 hover:text-slate-500"
                    }`}
                    aria-label={`Rate ${starValue} out of 5`}
                  >
                    ★
                  </button>
                );
              })}
            </div>
          </div>

          <label className="mt-6 block">
            <span className="text-sm font-semibold text-slate-900">Share your experience</span>
            <textarea
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
              rows={6}
              placeholder="Tell people about cleanliness, accessibility, and anything useful before they arrive."
              className="mt-2 w-full rounded-[1.75rem] border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>

          <label className="mt-6 block">
            <span className="text-sm font-semibold text-slate-900">Add photos</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoSelection}
              className="mt-2 block w-full rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </label>

          {photoPreviews.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {photoPreviews.map((preview, index) => (
                <div
                  key={preview.url}
                  className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="h-36 w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-2 px-3 py-2">
                    <p className="truncate text-xs text-slate-500">{preview.name}</p>
                    <button
                      type="button"
                      onClick={() => removeSelectedPhoto(index)}
                      className="rounded-full border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {submitError ? (
            <div className="mt-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitError}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitState === "saving" || rating < 1 || reviewText.trim().length < 10}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitState === "saving" ? "Saving review..." : "Save review"}
            </button>
            <Link
              href={`/toilets/${id}`}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Cancel
            </Link>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Review target</p>
            <p className="mt-2 text-sm text-slate-600">{toilet.name}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{toilet.address}</p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">What this review includes</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>Rating from 1 to 5 stars</li>
              <li>Written review text</li>
              <li>Optional photos linked to the review</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
