"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export function ContributionPanel() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Checking contribution access...
      </div>
    );
  }

  if (user) {
    return (
      <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-6">
        <p className="text-sm font-semibold text-emerald-950">Signed in and ready</p>
        <p className="mt-2 text-sm leading-6 text-emerald-900/80">
          Review writing and toilet submissions are the next features to wire,
          and your account is already in place for them.
        </p>
        <button
          type="button"
          className="mt-4 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          Leave a review soon
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
      <p className="text-sm font-semibold text-slate-900">Want to contribute?</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        You can keep browsing as a guest, but logging in is how we&apos;ll unlock
        reviews and new toilet submissions.
      </p>
      <Link
        href="/auth"
        className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Log in to contribute
      </Link>
    </div>
  );
}
