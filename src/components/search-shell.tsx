"use client";

import { useEffect, useState } from "react";
import { AuthPrompt } from "@/components/auth-prompt";
import { FilterPanel } from "@/components/filter-panel";
import { fetchToilets } from "@/lib/firebase/firestore";
import { MapPreview } from "@/components/map-preview";
import { ToiletCard } from "@/components/toilet-card";
import { filterToilets } from "@/lib/filter-toilets";
import { getManualLocation } from "@/lib/location";
import {
  defaultUserLocation,
  type ToiletRecord,
  type ToiletFilters,
  type UserLocation,
} from "@/lib/toilets";

const initialFilters: ToiletFilters = {
  minimumRating: 3,
  wheelchair: false,
  babyChanging: false,
  genderNeutral: false,
};

export function SearchShell() {
  const [manualLocation, setManualLocation] = useState(defaultUserLocation.label);
  const [userLocation, setUserLocation] = useState<UserLocation>(defaultUserLocation);
  const [filters, setFilters] = useState<ToiletFilters>(initialFilters);
  const [sourceToilets, setSourceToilets] = useState<ToiletRecord[]>([]);
  const [locationState, setLocationState] = useState<
    "idle" | "locating" | "found" | "manual"
  >("idle");
  const [dataState, setDataState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    setUserLocation(getManualLocation(manualLocation));
  }, [manualLocation]);

  useEffect(() => {
    let isCancelled = false;

    async function loadToilets() {
      try {
        const nextToilets = await fetchToilets();

        if (isCancelled) {
          return;
        }

        setSourceToilets(nextToilets);
        setDataState("ready");
      } catch {
        if (!isCancelled) {
          setDataState("error");
        }
      }
    }

    void loadToilets();

    return () => {
      isCancelled = true;
    };
  }, []);

  const toilets = filterToilets(sourceToilets, filters, userLocation);

  function detectLocation() {
    if (!navigator.geolocation) {
      setLocationState("manual");
      return;
    }

    setLocationState("locating");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: "Your current location",
        });
        setLocationState("found");
      },
      () => {
        setLocationState("manual");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Search nearby toilets
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
              Find a clean toilet fast.
            </h1>
          </div>

          <button
            type="button"
            onClick={detectLocation}
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {locationState === "locating" ? "Finding you..." : "Use my location"}
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px]">
          <input
            type="text"
            value={manualLocation}
            onChange={(event) => setManualLocation(event.target.value)}
            placeholder="Enter a neighbourhood or landmark"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400"
          />
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {locationState === "found"
              ? "Using live location"
              : locationState === "manual"
                ? "Manual location fallback"
                : `Searching around ${userLocation.label}`}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <FilterPanel filters={filters} onChange={setFilters} />

        <div className="space-y-6">
          <AuthPrompt />

          <MapPreview toilets={toilets} userLocation={userLocation} />

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Nearby toilets</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {toilets.length} result{toilets.length === 1 ? "" : "s"} around{" "}
                  {userLocation.label}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {dataState === "loading" ? (
                <div className="rounded-[1.75rem] border border-dashed border-slate-200 px-5 py-10 text-center text-sm text-slate-500">
                  Loading toilets from Firestore...
                </div>
              ) : null}

              {dataState === "error" ? (
                <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 px-5 py-10 text-center text-sm text-amber-900">
                  We couldn&apos;t load toilets from Firestore. Check the rules,
                  seeded docs, and browser console for details.
                </div>
              ) : null}

              {toilets.map((toilet) => (
                <ToiletCard key={toilet.id} toilet={toilet} />
              ))}

              {dataState === "ready" && toilets.length === 0 ? (
                <div className="rounded-[1.75rem] border border-dashed border-slate-200 px-5 py-10 text-center text-sm text-slate-500">
                  No toilets match those filters yet. Try lowering the minimum
                  cleanliness rating.
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
