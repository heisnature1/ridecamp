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
import Faqs from "./pages/Faqs";
import Contact from "./pages/Contact";
import SpecSheet from "./pages/SpecSheet";
import { Privacy, Terms } from "./pages/Legal";

import Admin from "./pages/Admin";

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

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ekon" element={<Ekon />} />
          <Route path="/battery-swap" element={<BatterySwap />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/fleet" element={<Fleet />} />
          {/* Ownership & financing moved onto Fleet & Business; Why Electric onto Service. */}
          <Route path="/ownership" element={<Navigate to="/fleet#financing" replace />} />
          <Route path="/why-electric" element={<Navigate to="/service#why-electric" replace />} />
          <Route path="/service" element={<Service />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/spec-sheet" element={<SpecSheet />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <FloatingActions />
    </BrowserRouter>
  );
}
