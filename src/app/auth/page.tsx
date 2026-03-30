import { AuthCard } from "@/components/auth-card";

export default function AuthPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5.5rem)] w-full max-w-6xl items-center px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid w-full gap-8 rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            where2p account
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
            Keep browsing as a guest, or log in to contribute.
          </h1>
          <p className="mt-5 text-sm leading-7 text-slate-300">
            Accounts are optional. Guests can still search and view toilet
            details, while signed-in users are ready for review submission and
            adding new toilets once those actions are enabled.
          </p>

          <div className="mt-8 space-y-3 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              Leave reviews about cleanliness and accessibility
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              Add new toilet locations to the community map
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              Keep guest browsing fast and friction-free
            </div>
          </div>
        </div>

        <AuthCard />
      </section>
    </main>
  );
}
