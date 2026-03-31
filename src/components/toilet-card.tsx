import Link from "next/link";
import { formatDistance } from "@/lib/location";
import type { ToiletSearchResult } from "@/lib/filter-toilets";
import { RatingStars } from "@/components/rating-stars";
import { Tag } from "@/components/tag";

export function ToiletCard({ toilet }: { toilet: ToiletSearchResult }) {
  return (
    <Link
      href={`/toilets/${toilet.id}`}
      className="block rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            {formatDistance(toilet.distanceKm)} away
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-950">{toilet.name}</h3>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {toilet.rating.toFixed(1)}
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">{toilet.description}</p>

      <div className="mt-4 flex items-center gap-3">
        <RatingStars rating={toilet.rating} />
        <span className="text-sm text-slate-500">{toilet.reviewCount} reviews</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {toilet.accessibility.map((feature) => (
          <Tag key={feature} feature={feature} />
        ))}
      </div>
    </Link>
  );
}
