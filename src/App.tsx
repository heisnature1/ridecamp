import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import Home from "./pages/Home";
import Ekon from "./pages/Ekon";
import WhyElectric from "./pages/WhyElectric";
import BatterySwap from "./pages/BatterySwap";
import CalculatorPage from "./pages/CalculatorPage";
import Ownership from "./pages/Ownership";
import Fleet from "./pages/Fleet";
import Service from "./pages/Service";
import About from "./pages/About";
import Faqs from "./pages/Faqs";
import Contact from "./pages/Contact";
import SpecSheet from "./pages/SpecSheet";
import { Privacy, Terms } from "./pages/Legal";

import Admin from "./pages/Admin";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ekon" element={<Ekon />} />
          <Route path="/why-electric" element={<WhyElectric />} />
          <Route path="/battery-swap" element={<BatterySwap />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/ownership" element={<Ownership />} />
          <Route path="/fleet" element={<Fleet />} />
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
