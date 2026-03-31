"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export function AuthPrompt() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        Checking account access...
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Guest browsing stays open</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Anyone can search toilets. Log in when you want to leave reviews or add
        new toilets later.
      </p>
      <Link
        href="/auth"
        className="mt-4 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Log in or sign up
      </Link>
    </div>
  );
}
