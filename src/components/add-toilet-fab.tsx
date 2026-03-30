"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export function AddToiletFab() {
  const { user } = useAuth();
  const href = user ? "/toilets/new" : "/auth";

  return (
    <Link
      href={href}
      aria-label={user ? "Add a new toilet" : "Log in to add a new toilet"}
      className="absolute bottom-5 left-5 inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.18)] ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(15,23,42,0.22)]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-2xl leading-none text-white">
        +
      </span>
      <span className="flex flex-col leading-tight">
        <span>Add toilet</span>
        <span className="text-xs font-medium text-slate-500">
          {user ? "Start workflow" : "Login required"}
        </span>
      </span>
    </Link>
  );
}
