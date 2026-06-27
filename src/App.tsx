import { Routes, Route } from 'react-router-dom';
import Nav from './components/navbar';
import Footer from './components/footer';
import Home from './pages/home';
import Features from './pages/features';
import Architecture from './pages/architecture';
import Pricing from './pages/pricing';

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
