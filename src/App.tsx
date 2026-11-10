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
/**
 * Every route chunk tells the cover when it has arrived, so the waiting
 * transition can hold until the page a visitor asked for is genuinely here
 * rather than for a fixed guess at how long it might take.
 */
function page<T extends { default: React.ComponentType }>(load: () => Promise<T>) {
  return lazy(() =>
    load().then((module) => {
      markLoaded();
      return module;
    }),
  );
}

const Home = page(() => import("./pages/Home"));
const Ekon = page(() => import("./pages/Ekon"));
const BatterySwap = page(() => import("./pages/BatterySwap"));
const CalculatorPage = page(() => import("./pages/CalculatorPage"));
const Fleet = page(() => import("./pages/Fleet"));
const Service = page(() => import("./pages/Service"));
const About = page(() => import("./pages/About"));
const Contact = page(() => import("./pages/Contact"));
const SpecSheet = page(() => import("./pages/SpecSheet"));
const Gallery = page(() => import("./pages/Gallery"));
const Login = page(() => import("./pages/Login"));
const Admin = page(() => import("./pages/Admin"));
const NotFound = page(() => import("./pages/NotFound"));
const Privacy = page(() => import("./pages/Legal").then((m) => ({ default: m.Privacy })));
const Terms = page(() => import("./pages/Legal").then((m) => ({ default: m.Terms })));
import { ScrollProgress } from "./components/motion/RouteTransition";
import PageTransition from "./components/motion/PageTransition";
import BootSplash, { LogoLoader } from "./components/motion/LogoLoader";
import { requestScrollRefresh } from "./lib/scrollRefresh";
import { markLoaded } from "./lib/cover";
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

/**
 * A redirect has no chunk to download, so it tells the cover there is nothing
 * to wait for before it swaps the route.
 */
function Redirect({ to }: { to: string }) {
  useEffect(() => {
    markLoaded();
  }, []);
  return <Navigate to={to} replace />;
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
    <div className="grid min-h-[70vh] place-items-center bg-navy text-white" role="status" aria-live="polite">
      <LogoLoader size={150} />
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
      <PageTransition />
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
          <Route path="/ownership" element={<Redirect to="/fleet#financing" />} />
          <Route path="/why-electric" element={<Redirect to="/service#why-electric" />} />
          <Route path="/service" element={<Service />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/spec-sheet" element={<SpecSheet />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminGuard />} />
          <Route path="/faqs" element={<Redirect to="/#faqs" />} />
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
      <BootSplash />
      <Shell />
    </BrowserRouter>
  );
}