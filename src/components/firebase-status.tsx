"use client";

import { getFirebaseApp, hasRequiredFirebaseEnv } from "@/lib/firebase/client";

export function FirebaseStatus() {
  const isConfigured = hasRequiredFirebaseEnv();

  if (!isConfigured) {
    return (
      <div className="rounded-3xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
        <p className="text-xs font-semibold uppercase tracking-[0.24em]">
          Firebase setup needed
        </p>
        <p className="mt-2 text-sm text-amber-900/80">
          Add your Firebase keys to <code>.env.local</code> to enable the real
          backend.
        </p>
      </div>
    );
  }

  const app = getFirebaseApp();

  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
      <p className="text-xs font-semibold uppercase tracking-[0.24em]">
        Firebase ready
      </p>
      <p className="mt-2 text-sm text-emerald-900/80">
        Connected to <strong>{app.options.projectId}</strong> and ready for
        Firestore data.
      </p>
    </div>
  );
}
