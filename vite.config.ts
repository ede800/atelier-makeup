import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages sert le site sous /atelier-makeup/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/atelier-makeup/' : '/',
  plugins: [react(), tailwindcss()],
  // Le catalogue (242 produits, 123 marques) est volontairement embarqué dans un seul bundle.
  build: { chunkSizeWarningLimit: 800 },
}));
