import FirebaseStatus from "@/app/components/firebase-status";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,210,164,0.45),transparent_30%),linear-gradient(135deg,#fff8ef_0%,#f2f6ff_45%,#eef9f0_100%)] text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
              where2p web
            </p>
            <h1 className="mt-6 font-sans text-5xl font-semibold tracking-[-0.04em] text-balance text-slate-950 sm:text-6xl lg:text-7xl">
              We just gave the web version a real backend starting point.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
              Firebase is wired in as the first backend layer for the portfolio
              build. Once your environment variables are in place, this app can
              initialize the SDK and grow into auth, Firestore, storage, and
              whatever else the product needs.
            </p>

            <div className="mt-10 flex flex-col gap-4 text-sm text-slate-700 sm:flex-row sm:flex-wrap">
              <div className="rounded-full border border-slate-300/70 bg-white/70 px-5 py-3 backdrop-blur">
                Next.js 16 app router
              </div>
              <div className="rounded-full border border-slate-300/70 bg-white/70 px-5 py-3 backdrop-blur">
                Firebase SDK installed
              </div>
              <div className="rounded-full border border-slate-300/70 bg-white/70 px-5 py-3 backdrop-blur">
                Env-based config ready
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/65 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8">
            <FirebaseStatus />

            <div className="mt-6 rounded-[1.5rem] bg-slate-950 px-6 py-5 text-slate-100">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                next step
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                After this, we can wire up Firebase Auth and a first Firestore
                collection so the site has a proper demo flow for startups and
                portfolio reviewers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
