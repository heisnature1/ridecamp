import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Logo from "../components/Logo";
import { loginThrottle, signIn, useAdmin } from "../lib/auth";

/**
 * Internal login, sitting in front of /admin.
 *
 * Signs in with Supabase Auth (email + password), so the session is a real,
 * verifiable one and the database only hands over leads to a signed in admin.
 * After signing in the original /admin URL is restored.
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const from = useLocation();
  const { admin } = useAdmin();

  if (admin) {
    return <Navigate to={from.state?.from?.pathname ?? "/admin"} replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // server side counter: 5 attempts per 10 minutes per address
      const retryAfter = await loginThrottle(email);
      if (retryAfter > 0) {
        setError(
          `Too many sign in attempts. Try again in ${Math.ceil(retryAfter / 60)} minute${
            retryAfter <= 60 ? "" : "s"
          }.`,
        );
        setLoading(false);
        return;
      }
      await signIn(email, password);
      window.location.assign(from.state?.from?.pathname ?? "/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That email or password isn't recognised.");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-4 py-16">
      {/* Same Ekon 450 M1 hero photograph as the landing page, used as a backdrop. */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/images/motor.jpg"
          alt=""
          className="size-full object-cover opacity-45 animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/90 to-navy/60" />
        <div className="absolute inset-0 hero-bg-pattern opacity-40" />
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-brand/20 blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 size-72 rounded-full bg-cyan-500/20 blur-3xl animate-float"
          style={{ animationDelay: "-2s" }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white p-8 shadow-2xl shadow-black/40">
          <div className="flex flex-col items-center text-center">
            <Logo />
            <h1 className="mt-6 font-display text-2xl font-bold text-navy">Admin login</h1>
            <p className="mt-1 text-xs text-slate">Internal dashboard — authorised staff only</p>
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
        <p className="mt-5 text-center text-[11px] text-white/45">
          © 2026 Future Ride Ltd · Spiro distributor, Ghana
        </p>
      </div>
    </div>
  );
}
