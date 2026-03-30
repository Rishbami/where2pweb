import Link from "next/link";
import { FirebaseStatus } from "@/components/firebase-status";

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-slate-500">
              where2p
            </p>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-6xl">
              Find a nearby toilet that actually works for you.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A fast, mobile-first MVP for finding nearby toilets by cleanliness,
              accessibility, and practical features like baby-changing.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/search"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Find toilets near me
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
              >
                Browse sample results
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                Cleanliness ratings
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                Accessibility tags
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                Google Maps directions
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Nearby now
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-950">5</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Mock locations seeded and ready to be swapped for Firestore.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Main filters
                </p>
                <p className="mt-3 text-lg font-semibold">Clean, accessible, fast</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Keep the flow simple, immediate, and easy to demo.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
              <FirebaseStatus />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
