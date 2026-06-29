export interface NavRoute {
  to: string;
  label: string;
  end: boolean;
}

export const ROUTES = {
  home:         '/',
  features:     '/features',
  architecture: '/architecture',
  pricing:      '/pricing',
  docs:         '/docs',
} as const;

export const NAV_LINKS: readonly NavRoute[] = [
  { to: ROUTES.home,         label: 'Home',         end: true  },
  { to: ROUTES.features,     label: 'Features',     end: false },
  { to: ROUTES.architecture, label: 'Architecture', end: false },
  { to: ROUTES.pricing,      label: 'Pricing',      end: false },
  { to: ROUTES.docs,         label: 'Docs',         end: false },
] as const;
