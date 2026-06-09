import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Legacy wc-* colors (kept for compatibility)
        wc: {
          gold: '#B45309',
          green: '#065F46',
          red: '#C8102E',
          dark: '#FFFFFF',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
        // Sticker Arena 2026 design tokens
        'on-surface': '#191c1e',
        'on-surface-variant': '#434655',
        'surface': '#f7f9fb',
        'background': '#f7f9fb',
        'surface-container': '#eceef0',
        'surface-container-low': '#f2f4f6',
        'surface-container-high': '#e6e8ea',
        'surface-container-highest': '#e0e3e5',
        'surface-container-lowest': '#ffffff',
        'primary': '#004ac6',
        'on-primary': '#ffffff',
        'primary-container': '#2563eb',
        'on-primary-container': '#eeefff',
        'secondary': '#795900',
        'on-secondary': '#ffffff',
        'secondary-container': '#ffc329',
        'on-secondary-container': '#6f5100',
        'secondary-fixed-dim': '#f9bd22',
        'tertiary': '#006229',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#007e37',
        'outline': '#737686',
        'outline-variant': '#c3c6d7',
        'pitch-green': '#16A34A',
        'sky-blue': '#60A5FA',
        'sticker-white': '#FFFFFF',
        'error': '#ba1a1a',
        'on-error': '#ffffff',
        'inverse-surface': '#2d3133',
        'inverse-on-surface': '#eff1f3',
        'inverse-primary': '#b4c5ff',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
