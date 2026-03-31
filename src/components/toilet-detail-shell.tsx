"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RatingStars } from "@/components/rating-stars";
import { Tag } from "@/components/tag";
import { fetchReviewsByToiletId, fetchToiletById } from "@/lib/firebase/firestore";
import type { ReviewRecord, ToiletRecord } from "@/lib/toilets";

export function ToiletDetailShell({ id }: { id: string }) {
  const [toilet, setToilet] = useState<ToiletRecord | null>(null);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found" | "error">(
    "loading",
  );

  useEffect(() => {
    let isCancelled = false;

    async function loadToilet() {
      try {
        const [nextToilet, nextReviews] = await Promise.all([
          fetchToiletById(id),
          fetchReviewsByToiletId(id),
        ]);

        if (isCancelled) {
          return;
        }

        if (!nextToilet) {
          setStatus("not-found");
          return;
        }

        setToilet(nextToilet);
        setReviews(nextReviews);
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

  if (status === "loading") {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/search" className="text-sm font-medium text-slate-500">
          ← Back to results
        </Link>
        <section className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-slate-500">Loading toilet details...</p>
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
              : "We hit a problem loading this toilet."}
          </p>
        </section>
      </main>
    );
  }

  const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${toilet.location.lat},${toilet.location.lng}`;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Link href="/search" className="text-sm font-medium text-slate-500">
        ← Back to results
      </Link>

      <section className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Toilet details
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
              {toilet.name}
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              {toilet.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <RatingStars rating={toilet.rating} />
              <span className="text-sm font-medium text-slate-700">
                {toilet.reviewCount === 0 ? "Not yet rated" : toilet.rating.toFixed(1)}
              </span>
              <span className="text-sm text-slate-500">
                {toilet.reviewCount} review{toilet.reviewCount === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {toilet.accessibility.map((feature) => (
                <Tag key={feature} feature={feature} />
              ))}
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Address</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{toilet.address}</p>
              <p className="mt-4 text-sm font-semibold text-slate-900">Opening hours</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {toilet.openingHours}
              </p>
              <Link
                href={`/toilets/${toilet.id}/review`}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Leave a review
              </Link>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Recent reviews</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {reviews.length} review{reviews.length === 1 ? "" : "s"} for this toilet
                  </p>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-semibold text-slate-900">
                          {review.userEmail ?? "Community member"}
                        </p>
                        <RatingStars rating={review.rating} />
                        <span className="text-sm text-slate-500">
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{review.text}</p>

                      {review.photoUrls.length > 0 ? (
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {review.photoUrls.map((photoUrl) => (
                            <div
                              key={photoUrl}
                              className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={photoUrl}
                                alt={`Review photo for ${toilet.name}`}
                                className="h-40 w-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : null}

                      <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                        {review.updatedAt
                          ? review.updatedAt.toLocaleDateString()
                          : "Recently added"}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-[1.5rem] border border-dashed border-slate-200 px-5 py-8 text-sm text-slate-500">
                  No reviews yet. Be the first to leave one.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Navigate with Google Maps
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
