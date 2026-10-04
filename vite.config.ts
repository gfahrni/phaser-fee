import { defineConfig } from 'vite';

export default defineConfig({
  // Le repo GitHub Pages est servi sous /phaser-fee/
  base: '/phaser-fee/',
  server: { host: true },
  build: { target: 'es2020' },
});
