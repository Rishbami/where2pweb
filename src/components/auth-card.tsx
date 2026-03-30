"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

type AuthMode = "login" | "signup";

export function AuthCard() {
  const router = useRouter();
  const { isConfigured, login, register, user } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isConfigured) {
      setMessage("Firebase auth is not configured yet.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      if (mode === "login") {
        await login(email, password);
        setMessage("Logged in successfully.");
      } else {
        await register(email, password);
        setMessage("Account created successfully.");
      }

      router.push("/search");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (user) {
    return (
      <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 text-emerald-950 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em]">
          Signed in
        </p>
        <h2 className="mt-3 text-2xl font-semibold">You are ready to contribute.</h2>
        <p className="mt-3 text-sm leading-7 text-emerald-900/80">
          Browse toilets as normal, and when review submission or adding new
          toilets goes live, your account will unlock that flow.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex gap-2 rounded-full bg-slate-100 p-1">
        {(["login", "signup"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === value ? "bg-slate-950 text-white" : "text-slate-600"
            }`}
          >
            {value === "login" ? "Login" : "Create account"}
          </button>
        ))}
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Email address"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Password"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmitting
            ? mode === "login"
              ? "Logging in..."
              : "Creating account..."
            : mode === "login"
              ? "Login"
              : "Create account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => router.push("/search")}
        className="mt-4 w-full rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
      >
        Continue as guest
      </button>

      {message ? (
        <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {message}
        </p>
      ) : null}
    </div>
  );
}
