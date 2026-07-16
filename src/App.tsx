import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Nav from './components/navbar';
import Footer from './components/footer';
import ShaderCanvas from './components/shader-canvas';
import ErrorBoundary from './components/error-boundary';
import Home from './pages/home';

// Route-level code splitting: each page is fetched only when first visited,
// keeping the initial bundle (landing page) small. Home stays eager since it
// is the entry route and should paint immediately without a fallback flash.
const Features = lazy(() => import('./pages/features'));
const Architecture = lazy(() => import('./pages/architecture'));
const Pricing = lazy(() => import('./pages/pricing'));
const Docs = lazy(() => import('./pages/docs'));
const Blog = lazy(() => import('./pages/blog'));
const ContactUs = lazy(() => import('./pages/contact-us/index'));
const NotFound = lazy(() => import('./pages/not-found'));

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

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant/40 border-t-primary" />
    </div>
  );
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
          <ErrorBoundary>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/"             element={<Home />} />
                <Route path="/features"     element={<Features />} />
                <Route path="/architecture" element={<Architecture />} />
                <Route path="/pricing"      element={<Pricing />} />
                <Route path="/docs"         element={<Docs />} />
                <Route path="/blog"         element={<Blog />} />
                <Route path="/blog/:slug"   element={<Blog />} />
                <Route path="/contact-us"   element={<ContactUs />} />
                <Route path="*"             element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </div>
  );
}
