"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

const navItems = [
  { href: "/search", label: "Search" },
  { href: "/auth", label: "Account" },
] as const;

export function TopNav() {
  const pathname = usePathname();
  const { user, isLoading, signOutUser } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <Link
            href="/search"
            className="text-lg font-semibold tracking-[-0.03em] text-slate-950"
          >
            where2p
          </Link>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
            Guest-friendly toilet finder
          </p>
        </div>

        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <span className="text-sm text-slate-400">Checking account...</span>
          ) : user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-900">
                  {user.email ?? "Signed in"}
                </p>
                <p className="text-xs text-slate-500">
                  Can review toilets and add new listings later
                </p>
              </div>
              <button
                type="button"
                onClick={() => void signOutUser()}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
