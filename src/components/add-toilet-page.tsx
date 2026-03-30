"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

const checklist = [
  "Drop a pin on the map",
  "Name the toilet location",
  "Add address or landmark details",
  "Set accessibility features",
  "Save the listing to Firestore",
];

export function AddToiletPage() {
  const { user, isLoading } = useAuth();

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
      <section className="grid w-full gap-8 rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Add toilet
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
            Start a new toilet listing.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
            This branch now has the real entry point. Next we can replace this
            scaffold with the actual form fields and Firestore write flow.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Signed in as</p>
              <p className="mt-2 text-sm text-slate-500">{user.email}</p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Status</p>
              <p className="mt-2 text-sm text-slate-500">
                Ready to create community listings
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Workflow
          </p>
          <ol className="mt-5 space-y-3">
            {checklist.map((item, index) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-950">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>

          <Link
            href="/search"
            className="mt-6 inline-flex rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30"
          >
            Back to map
          </Link>
        </div>
      </section>
    </main>
  );
}
