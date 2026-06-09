import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        wc: {
          gold: '#C9A84C',
          green: '#006233',
          red: '#C8102E',
          dark: '#0A0F1E',
          card: '#111827',
          border: '#1F2D3D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
