import type { Config } from 'tailwindcss';

// All color tokens are driven by CSS custom properties set in index.css.
// This lets the same Tailwind classes work for both dark and light themes
// just by toggling data-theme on <html>.
const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background:                  'rgb(var(--c-bg)           / <alpha-value>)',
        surface:                     'rgb(var(--c-bg)           / <alpha-value>)',
        'surface-dim':               'rgb(var(--c-surface-dim)  / <alpha-value>)',
        'surface-bright':            'rgb(var(--c-surface-bright)/ <alpha-value>)',
        'surface-container-lowest':  'rgb(var(--c-sc-lowest)    / <alpha-value>)',
        'surface-container-low':     'rgb(var(--c-sc-low)       / <alpha-value>)',
        'surface-container':         'rgb(var(--c-sc)           / <alpha-value>)',
        'surface-container-high':    'rgb(var(--c-sc-high)      / <alpha-value>)',
        'surface-container-highest': 'rgb(var(--c-sc-highest)   / <alpha-value>)',
        'surface-variant':           'rgb(var(--c-sc-highest)   / <alpha-value>)',
        'on-background':             'rgb(var(--c-on-surface)   / <alpha-value>)',
        'on-surface':                'rgb(var(--c-on-surface)   / <alpha-value>)',
        'on-surface-variant':        'rgb(var(--c-on-sv)        / <alpha-value>)',
        primary:                     'rgb(var(--c-primary)      / <alpha-value>)',
        'primary-fixed':             'rgb(var(--c-primary-fixed)/ <alpha-value>)',
        'primary-fixed-dim':         'rgb(var(--c-primary)      / <alpha-value>)',
        'on-primary':                'rgb(var(--c-on-primary)   / <alpha-value>)',
        'on-primary-fixed':          'rgb(var(--c-on-primary)   / <alpha-value>)',
        secondary:                   'rgb(var(--c-secondary)    / <alpha-value>)',
        'secondary-container':       'rgb(var(--c-sec-ctr)      / <alpha-value>)',
        'on-secondary-container':    'rgb(var(--c-on-sec-ctr)   / <alpha-value>)',
        tertiary:                    'rgb(var(--c-tertiary)     / <alpha-value>)',
        'tertiary-container':        'rgb(var(--c-ter-ctr)      / <alpha-value>)',
        'on-tertiary-container':     'rgb(var(--c-on-ter-ctr)   / <alpha-value>)',
        error:                       'rgb(var(--c-error)        / <alpha-value>)',
        'error-container':           'rgb(var(--c-err-ctr)      / <alpha-value>)',
        outline:                     'rgb(var(--c-outline)      / <alpha-value>)',
        'outline-variant':           'rgb(var(--c-outline-v)    / <alpha-value>)',
        'inverse-primary':           'rgb(var(--c-inv-primary)  / <alpha-value>)',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
      spacing: {
        'container-max': '1440px',
        'margin-mobile': '16px',
        'margin-desktop': '40px',
        gutter: '24px',
        unit: '4px',
        'stack-xs': '4px',
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '24px',
        'stack-xl': '48px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Geist', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-lg':  ['48px', { lineHeight: '1.1', letterSpacing: '-0.04em', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg':     ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md':     ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm':     ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'label-caps':  ['12px', { lineHeight: '1',   letterSpacing: '0.05em', fontWeight: '600' }],
        'code-md':     ['14px', { lineHeight: '1.6', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};

export default config;
