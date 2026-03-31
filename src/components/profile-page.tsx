"use client";

import { useEffect, useState } from "react";
import { AuthCard } from "@/components/auth-card";
import { useAuth } from "@/components/auth-provider";
import {
  fetchProfileStats,
  fetchRecentProfileActivity,
} from "@/lib/firebase/firestore";

function formatRelativeDate(value: Date | null) {
  if (!value) {
    return "Recently";
  }

  const diffMs = Date.now() - value.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const dayDiff = Math.max(0, Math.floor(diffMs / dayMs));

  if (dayDiff === 0) {
    return "Today";
  }

  if (dayDiff === 1) {
    return "1 day ago";
  }

  if (dayDiff < 7) {
    return `${dayDiff} days ago`;
  }

  const weekDiff = Math.floor(dayDiff / 7);
  if (weekDiff === 1) {
    return "1 week ago";
  }

  if (weekDiff < 5) {
    return `${weekDiff} weeks ago`;
  }

  return value.toLocaleDateString();
}

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
  const [activity, setActivity] = useState<
    Array<{
      id: string;
      type: "review" | "toilet";
      title: string;
      meta: string;
      occurredAt: Date | null;
    }>
  >([]);

  useEffect(() => {
    let isCancelled = false;

    async function loadStats() {
      if (!user) {
        setStats({
          reviewCount: 0,
          photoCount: 0,
          toiletsAddedCount: 0,
        });
        setActivity([]);
        setStatsState("idle");
        return;
      }

      try {
        setStatsState("loading");
        const [nextStats, nextActivity] = await Promise.all([
          fetchProfileStats(user.uid),
          fetchRecentProfileActivity(user.uid),
        ]);

        if (isCancelled) {
          return;
        }

        setStats(nextStats);
        setActivity(nextActivity);
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
                activity.length > 0 ? (
                  activity.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.meta}</p>
                      <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                        {formatRelativeDate(item.occurredAt)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      No recent activity yet
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Leave a review or add a toilet and it will appear here.
                    </p>
                  </div>
                )
              ) : null}
            </div>
          </div>

          <div>
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
