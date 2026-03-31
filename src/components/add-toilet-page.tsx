"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AddToiletMap } from "@/components/add-toilet-map";
import { useAuth } from "@/components/auth-provider";
import { createToilet } from "@/lib/firebase/firestore";
import { defaultUserLocation, type UserLocation } from "@/lib/toilets";

type PinLocation = {
  lat: number;
  lng: number;
};

export function AddToiletPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [userLocation, setUserLocation] = useState<UserLocation>(defaultUserLocation);
  const [pinLocation, setPinLocation] = useState<PinLocation | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [wheelchair, setWheelchair] = useState(false);
  const [babyChanging, setBabyChanging] = useState(false);
  const [genderNeutral, setGenderNeutral] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [locationState, setLocationState] = useState<
    "idle" | "locating" | "found" | "fallback"
  >("idle");

  useEffect(() => {
    if (!user || !navigator.geolocation) {
      return;
    }

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
        setLocationState("fallback");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [user]);

  function detectLocation() {
    if (!navigator.geolocation) {
      setLocationState("fallback");
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
        setLocationState("fallback");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  const accessibility = [
    wheelchair ? "wheelchair" : null,
    babyChanging ? "baby-changing" : null,
    genderNeutral ? "gender-neutral" : null,
  ].filter((value): value is "wheelchair" | "baby-changing" | "gender-neutral" => Boolean(value));

  const canSubmit =
    Boolean(user) &&
    Boolean(pinLocation) &&
    name.trim().length >= 3 &&
    address.trim().length >= 5 &&
    description.trim().length >= 10 &&
    openingHours.trim().length >= 3 &&
    submitState !== "saving";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !pinLocation || !canSubmit) {
      return;
    }

    try {
      setSubmitState("saving");
      setSubmitError(null);

      const toiletId = await createToilet(
        {
          name,
          address,
          description,
          openingHours,
          location: pinLocation,
          accessibility,
        },
        { uid: user.uid, email: user.email },
      );

      router.push(`/toilets/${toiletId}`);
    } catch (error) {
      setSubmitState("error");
      setSubmitError(
        error instanceof Error ? error.message : "We could not save that toilet yet.",
      );
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-5.5rem)] w-full max-w-6xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <section className="w-full rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-slate-500">Checking account access...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-5.5rem)] w-full max-w-5xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <section className="w-full rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Add toilet
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
            Log in to add a new toilet.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Guests can browse the map freely, but adding new toilet locations is
            tied to an account so we can show profile activity and keep the data
            traceable.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Go to account
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Back to search
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5.5rem)] w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid w-full gap-8 rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[minmax(0,1.2fr)_360px]">
        <form onSubmit={handleSubmit}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Add toilet
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
            Drop the pin for your new toilet listing.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
            Start by placing the map marker where the toilet actually is. Once
            the pin is right, we can hang the name, landmark, accessibility,
            and save flow off this page.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={detectLocation}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {locationState === "locating" ? "Finding you..." : "Use my location"}
            </button>
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Back to map
            </Link>
          </div>

          <div className="mt-6">
            <AddToiletMap
              userLocation={userLocation}
              pinLocation={pinLocation}
              onPinChange={setPinLocation}
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="text-sm font-semibold text-slate-900">Location name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Central Library Main Entrance"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="md:col-span-2">
              <span className="text-sm font-semibold text-slate-900">Address or landmark</span>
              <input
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Street address or nearest landmark"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="md:col-span-2">
              <span className="text-sm font-semibold text-slate-900">Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Tell people how to find it, what shape it is in, and anything useful before they arrive."
                rows={5}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="md:col-span-2">
              <span className="text-sm font-semibold text-slate-900">Opening hours</span>
              <input
                type="text"
                value={openingHours}
                onChange={(event) => setOpeningHours(event.target.value)}
                placeholder="e.g. Open daily · 7am to 10pm"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>

          <div className="mt-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Accessibility features</p>
            <div className="mt-4 space-y-3">
              <label className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3">
                <span className="text-sm text-slate-700">Wheelchair accessible</span>
                <input
                  type="checkbox"
                  checked={wheelchair}
                  onChange={(event) => setWheelchair(event.target.checked)}
                  className="h-5 w-5 accent-slate-950"
                />
              </label>
              <label className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3">
                <span className="text-sm text-slate-700">Baby-changing facilities</span>
                <input
                  type="checkbox"
                  checked={babyChanging}
                  onChange={(event) => setBabyChanging(event.target.checked)}
                  className="h-5 w-5 accent-slate-950"
                />
              </label>
              <label className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3">
                <span className="text-sm text-slate-700">Gender-neutral</span>
                <input
                  type="checkbox"
                  checked={genderNeutral}
                  onChange={(event) => setGenderNeutral(event.target.checked)}
                  className="h-5 w-5 accent-slate-950"
                />
              </label>
            </div>
          </div>

          {submitError ? (
            <div className="mt-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitError}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitState === "saving" ? "Saving toilet..." : "Add listing"}
            </button>
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Cancel
            </Link>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Listing owner
            </p>
            <p className="mt-4 text-lg font-semibold">{user.email ?? "Signed in"}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              New listings are attached to your account before they are pushed
              into Firestore for the rest of the community to browse.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Map status
            </p>
            <p className="mt-4 text-lg font-semibold text-slate-950">
              {pinLocation ? "Pin placed" : "Waiting for pin"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {locationState === "found"
                ? "The map is centered on your current location."
                : "We are using the default map centre until location is available."}
            </p>

            <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Selected coordinates</p>
              {pinLocation ? (
                <div className="mt-2 space-y-1">
                  <p>Latitude: {pinLocation.lat.toFixed(6)}</p>
                  <p>Longitude: {pinLocation.lng.toFixed(6)}</p>
                </div>
              ) : (
                <p className="mt-2">
                  Tap anywhere on the map to place the new toilet marker.
                </p>
              )}
            </div>

            <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">What gets created</p>
              <p className="mt-2">
                We save the location, description, opening hours, accessibility
                tags, starter rating, and account metadata needed for the toilet
                to appear in search immediately.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
