import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Logo from "../components/Logo";

/**
 * Internal login — sits in front of /admin. Credentials are checked against the
 * env-supplied pair; on success the session is remembered for the rest of the
 * browser life and the original /admin URL (with any query string) is restored.
 */
const USER = import.meta.env.VITE_ADMIN_USER ?? "admin@futureride.gh";
const PASS = import.meta.env.VITE_ADMIN_PASS ?? "future-ride";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const from = useLocation();

  if (typeof window !== "undefined" && window.localStorage.getItem("fr_admin_session") === "1") {
    return <Navigate to={from.state?.from?.pathname ?? "/admin"} replace />;
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // tiny delay so the button feels responsive
    window.setTimeout(() => {
      if (email === USER && password === PASS) {
        window.localStorage.setItem("fr_admin_session", "1");
        window.location.assign(from.state?.from?.pathname ?? "/admin");
      } else {
        setError("That email or password isn't recognised.");
        setLoading(false);
      }
    }, 220);
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-cloud px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-line bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <Logo />
            <h1 className="mt-6 font-display text-2xl font-bold text-navy">Admin login</h1>
          </div>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <label className="block text-sm">
              <span className="font-semibold text-navy">Email</span>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@futureride.gh"
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy outline-none focus:border-brand"
              />
            </label>
            <label className="block text-sm">
              <span className="font-semibold text-navy">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy outline-none focus:border-brand"
              />
            </label>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 ring-1 ring-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-navy-soft active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Checking…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate">
            <Link to="/" className="font-semibold text-brand hover:underline">
              ← Back to the public site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}