"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthCard } from "@/components/auth-card";
import { useAuth } from "@/components/auth-provider";
import { fetchProfileStats } from "@/lib/firebase/firestore";

export function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState({
    reviewCount: 0,
    photoCount: 0,
    toiletsAddedCount: 0,
  });
  const [statsState, setStatsState] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );

  useEffect(() => {
    let isCancelled = false;

    async function loadStats() {
      if (!user) {
        setStats({
          reviewCount: 0,
          photoCount: 0,
          toiletsAddedCount: 0,
        });
        setStatsState("idle");
        return;
      }

      try {
        setStatsState("loading");
        const nextStats = await fetchProfileStats(user.uid);

        if (isCancelled) {
          return;
        }

        setStats(nextStats);
        setStatsState("ready");
      } catch {
        if (!isCancelled) {
          setStatsState("error");
        }
      }
    }

    void loadStats();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-5.5rem)] w-full max-w-6xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <section className="w-full rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-slate-500">Loading account...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-5.5rem)] w-full max-w-6xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid w-full gap-8 rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              where2p account
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
              Log in to unlock your profile.
            </h1>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              Guests can browse freely, but your account is where reviews,
              submitted toilets, and activity history will live.
            </p>

            <div className="mt-8 space-y-3 text-sm text-slate-200">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Track how many toilets you have added
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                See recent reviews and activity in one place
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Keep browsing without any login wall
              </div>
            </div>
          </div>

          <AuthCard />
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5.5rem)] w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="w-full overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-8 sm:px-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 text-3xl font-semibold text-slate-600">
              {(user.email?.[0] ?? "U").toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Profile
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                {user.displayName || "where2p user"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid border-b border-slate-200 sm:grid-cols-3">
          <div className="px-6 py-6 text-center sm:px-8">
            <p className="text-3xl font-semibold text-slate-950">{stats.reviewCount}</p>
            <p className="mt-1 text-sm text-slate-500">Reviews</p>
          </div>
          <div className="border-t border-slate-200 px-6 py-6 text-center sm:border-l sm:border-t-0 sm:px-8">
            <p className="text-3xl font-semibold text-slate-950">{stats.photoCount}</p>
            <p className="mt-1 text-sm text-slate-500">Photos</p>
          </div>
          <div className="border-t border-slate-200 px-6 py-6 text-center sm:border-l sm:border-t-0 sm:px-8">
            <p className="text-3xl font-semibold text-slate-950">
              {stats.toiletsAddedCount}
            </p>
            <p className="mt-1 text-sm text-slate-500">Toilets added</p>
          </div>
        </div>

        <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Recent activity</h2>
            <div className="mt-5 space-y-4">
              {statsState === "loading" ? (
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Loading live account stats...
                </div>
              ) : null}

              {statsState === "error" ? (
                <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  We couldn&apos;t load your live stats just now.
                </div>
              ) : null}

              {statsState !== "loading" && statsState !== "error" ? (
                <>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {stats.reviewCount} review{stats.reviewCount === 1 ? "" : "s"} written
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Your account stats are now coming from live Firebase review data.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {stats.photoCount} photo{stats.photoCount === 1 ? "" : "s"} uploaded
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Photo count is calculated from the review photos linked to your account.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {stats.toiletsAddedCount} toilet
                      {stats.toiletsAddedCount === 1 ? "" : "s"} added
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Toilet ownership is pulled from the listings created with your Firebase
                      account.
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Account actions</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                We will surface add-toilet and review submission shortcuts here
                on the next steps of this branch.
              </p>
              <Link
                href="/search"
                className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Back to search
              </Link>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">Account details</p>
              <dl className="mt-4 space-y-3 text-sm text-slate-500">
                <div className="flex items-center justify-between gap-4">
                  <dt>Email</dt>
                  <dd className="text-right text-slate-700">{user.email}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>Status</dt>
                  <dd className="text-right text-slate-700">Verified session</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>Role</dt>
                  <dd className="text-right text-slate-700">Community member</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
