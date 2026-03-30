"use client";

import type { ToiletFilters } from "@/lib/toilets";

type FilterPanelProps = {
  filters: ToiletFilters;
  onChange: (filters: ToiletFilters) => void;
};

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Filters</h2>

      <label className="mt-5 block">
        <span className="text-sm font-medium text-slate-700">
          Minimum cleanliness rating
        </span>
        <input
          className="mt-3 w-full accent-slate-950"
          type="range"
          min="1"
          max="5"
          step="1"
          value={filters.minimumRating}
          onChange={(event) =>
            onChange({
              ...filters,
              minimumRating: Number(event.target.value),
            })
          }
        />
        <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
          {filters.minimumRating}+
        </span>
      </label>

      <div className="mt-6 space-y-3">
        <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
          Wheelchair access
          <input
            type="checkbox"
            checked={filters.wheelchair}
            onChange={(event) =>
              onChange({ ...filters, wheelchair: event.target.checked })
            }
          />
        </label>
        <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
          Baby-changing
          <input
            type="checkbox"
            checked={filters.babyChanging}
            onChange={(event) =>
              onChange({ ...filters, babyChanging: event.target.checked })
            }
          />
        </label>
        <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
          Gender-neutral
          <input
            type="checkbox"
            checked={filters.genderNeutral}
            onChange={(event) =>
              onChange({ ...filters, genderNeutral: event.target.checked })
            }
          />
        </label>
      </div>
    </div>
  );
}
