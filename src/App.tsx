import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import CountryGate from "./components/CountryGate";
import Home from "./pages/Home";
import Bike from "./pages/Bike";
import SwapNetwork from "./pages/SwapNetwork";
import Technology from "./pages/Technology";
import About from "./pages/About";
import News from "./pages/News";
import Support from "./pages/Support";
import BookTestRide from "./pages/BookTestRide";
import Sustainability from "./pages/Sustainability";

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
      <CountryGate />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bike" element={<Bike />} />
          <Route path="/energy" element={<SwapNetwork />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/support" element={<Support />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/book-test-ride" element={<BookTestRide />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
