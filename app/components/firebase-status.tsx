"use client";

import { getFirebaseApp, hasRequiredFirebaseEnv } from "@/lib/firebase/client";

export default function FirebaseStatus() {
  const isConfigured = hasRequiredFirebaseEnv();

  if (!isConfigured) {
    return (
      <div className="rounded-[2rem] border border-amber-500/30 bg-amber-100/80 p-6 text-left text-amber-950 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.2em]">
          Firebase setup needed
        </p>
        <p className="mt-3 text-sm leading-7 text-amber-900/90">
          Copy <code>.env.example</code> to <code>.env.local</code> and paste in
          your Firebase web app credentials.
        </p>
      </div>
    );
  }

  const app = getFirebaseApp();

  return (
    <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-100/80 p-6 text-left text-emerald-950 backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.2em]">
        Firebase connected
      </p>
      <p className="mt-3 text-sm leading-7 text-emerald-900/90">
        SDK initialized for <strong>{app.options.projectId}</strong>. You can
        start layering in auth, Firestore, storage, or functions next.
      </p>
    </div>
  );
}
