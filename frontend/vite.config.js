// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // ← this is the key fix
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
