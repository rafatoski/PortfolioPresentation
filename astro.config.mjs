import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://rafatoski.github.io',
  base: '/PortfolioPresentation/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
