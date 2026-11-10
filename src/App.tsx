import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import Home from "./pages/Home";
import Ekon from "./pages/Ekon";
import BatterySwap from "./pages/BatterySwap";
import CalculatorPage from "./pages/CalculatorPage";
import Fleet from "./pages/Fleet";
import Service from "./pages/Service";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SpecSheet from "./pages/SpecSheet";
import Gallery from "./pages/Gallery";
import { Privacy, Terms } from "./pages/Legal";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import { useAdmin } from "./lib/auth";

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
 * Routes that stand on their own: the admin login and the admin dashboard have
 * no public site chrome (nav, footer, floating call/WhatsApp buttons).
 */
const STANDALONE_ROUTES = ["/login", "/admin"];

function Shell() {
  const { pathname } = useLocation();
  const standalone = STANDALONE_ROUTES.includes(pathname.replace(/\/+$/, "") || "/");

  return (
    <>
      <ScrollManager />
      {!standalone && <Nav />}
      <main>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!standalone && <Footer />}
      {!standalone && <FloatingActions />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}