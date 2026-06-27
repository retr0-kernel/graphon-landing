import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // HashRouter handles routing without a server — works on GitHub Pages, Netlify, any static host
  base: './',
});
