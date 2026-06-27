import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
import Architecture from './pages/Architecture';
import Pricing from './pages/Pricing';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/features"     element={<Features />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/pricing"      element={<Pricing />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
