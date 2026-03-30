import Link from "next/link";
import { notFound } from "next/navigation";
import { ContributionPanel } from "@/components/contribution-panel";
import { RatingStars } from "@/components/rating-stars";
import { Tag } from "@/components/tag";
import { getToiletById } from "@/lib/toilets";

export default async function ToiletDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const toilet = getToiletById(id);

  if (!toilet) {
    notFound();
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
                {toilet.rating.toFixed(1)}
              </span>
              <span className="text-sm text-slate-500">
                {toilet.reviewCount} placeholder reviews
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

            <ContributionPanel />

            <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900">Photos</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Placeholder for {toilet.photosCount} user photos and future upload
                support.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900">Reviews</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Placeholder for review snippets. Submission flow comes later once
                auth and moderation are in.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
              <p className="text-sm font-semibold text-slate-900">
                Firestore-ready collections
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                <li>
                  <code>toilets/{"{toiletId}"}</code> for location and metadata
                </li>
                <li>
                  <code>reviews/{"{reviewId}"}</code> for community feedback
                </li>
                <li>
                  <code>users/{"{userId}"}</code> reserved for profile data later
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
