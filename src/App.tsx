import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/navbar';
import Footer from './components/footer';
import ShaderCanvas from './components/shader-canvas';
import ErrorBoundary from './components/error-boundary';
import Home from './pages/home';
import Features from './pages/features';
import Architecture from './pages/architecture';
import Pricing from './pages/pricing';
import Docs from './pages/docs';
import Blog from './pages/blog';
import ContactUs from './pages/contact-us/index';
import NotFound from './pages/not-found';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    history.scrollRestoration = 'manual';
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const showGlobalCanvas = pathname !== '/';

  return (
    <div className="relative min-h-screen">
      {showGlobalCanvas && (
        <ShaderCanvas className="fixed inset-0 z-0 w-full h-full bg-background pointer-events-none" />
      )}
      <ScrollToTop />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/"             element={<ErrorBoundary><Home /></ErrorBoundary>} />
            <Route path="/features"     element={<ErrorBoundary><Features /></ErrorBoundary>} />
            <Route path="/architecture" element={<ErrorBoundary><Architecture /></ErrorBoundary>} />
            <Route path="/pricing"      element={<ErrorBoundary><Pricing /></ErrorBoundary>} />
            <Route path="/docs"         element={<ErrorBoundary><Docs /></ErrorBoundary>} />
            <Route path="/blog"         element={<ErrorBoundary><Blog /></ErrorBoundary>} />
            <Route path="/blog/:slug"   element={<ErrorBoundary><Blog /></ErrorBoundary>} />
            <Route path="/contact-us"   element={<ErrorBoundary><ContactUs /></ErrorBoundary>} />
            <Route path="*"             element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}
