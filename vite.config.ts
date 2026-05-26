import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'AVD West Bengal',
          short_name: 'AVDWB',
          description: 'Association of Veterinary Doctors West Bengal',
          theme_color: '#FF9933',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: 'https://ik.imagekit.io/avdwb/Logo/20260517%20Logo_AVD.webp?tr=f-png,w-192,h-192',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'https://ik.imagekit.io/avdwb/Logo/20260517%20Logo_AVD.webp?tr=f-png,w-512,h-512',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
