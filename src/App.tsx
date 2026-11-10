import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
/**
 * Routes are split so a first visit only downloads the page in front of the
 * visitor. The admin dashboard (and its charts, tables and drawer) never
 * reaches a public visitor, and the public pages never reach an admin.
 */
const Home = lazy(() => import("./pages/Home"));
const Ekon = lazy(() => import("./pages/Ekon"));
const BatterySwap = lazy(() => import("./pages/BatterySwap"));
const CalculatorPage = lazy(() => import("./pages/CalculatorPage"));
const Fleet = lazy(() => import("./pages/Fleet"));
const Service = lazy(() => import("./pages/Service"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const SpecSheet = lazy(() => import("./pages/SpecSheet"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Terms })));
import { RouteVeil, ScrollProgress } from "./components/motion/RouteTransition";
import { requestScrollRefresh } from "./lib/scrollRefresh";
import { useAdmin } from "./lib/auth";
import { clearLegacySession } from "./lib/supabase";

/**
 * Route changes go to the top of the page, unless the URL points at a section
 * (e.g. `/fleet#financing`, which the footer and the old /ownership link use).
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const id = hash.replace("#", "");
    if (id) {
      const frame = requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

/** /admin is only reachable with a signed in admin session, otherwise bounce to /login. */
function AdminGuard() {
  const { admin } = useAdmin();
  if (admin === undefined) {
    return (
      <div className="grid min-h-screen place-items-center bg-cloud text-sm text-slate">
        Checking your session…
      </div>
    );
  }
  if (!admin) {
    return <Navigate to="/login" state={{ from: { pathname: "/admin" } }} replace />;
  }
  return <Admin />;
}

/**
 * Shown for the moment a route chunk downloads. Deliberately plain: a skeleton
 * that fades in would flash on a fast connection, so this is a quiet brand mark
 * that only appears if the page is genuinely slow.
 */
function RouteFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <span className="size-8 animate-spin rounded-full border-2 border-line border-t-brand" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">Loading</span>
      </div>
    </div>
  );
}

/**
 * Routes that stand on their own: the admin login and the admin dashboard have
 * no public site chrome (nav, footer, floating call/WhatsApp buttons).
 */
const STANDALONE_ROUTES = ["/login", "/admin"];

function Shell() {
  const { pathname } = useLocation();
  const standalone = STANDALONE_ROUTES.includes(pathname.replace(/\/+$/, "") || "/");

  // ScrollTrigger caches element positions; a route change replaces them all
  useEffect(() => {
    requestScrollRefresh();
  }, [pathname]);

  return (
    <>
      <ScrollManager />
      {!standalone && <ScrollProgress />}
      <RouteVeil />
      {!standalone && <Nav />}
      <main>
        <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ekon" element={<Ekon />} />
          <Route path="/battery-swap" element={<BatterySwap />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/ownership" element={<Navigate to="/fleet#financing" replace />} />
          <Route path="/why-electric" element={<Navigate to="/service#why-electric" replace />} />
          <Route path="/service" element={<Service />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/spec-sheet" element={<SpecSheet />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminGuard />} />
          <Route path="/faqs" element={<Navigate to="/#faqs" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </main>
      {!standalone && <Footer />}
      {!standalone && <FloatingActions />}
    </>
  );
}

export default function App() {
  // a deployment from before Supabase Auth trusted a localStorage flag; make
  // sure no browser can still present it
  clearLegacySession();

  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}