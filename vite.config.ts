import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const allowedHosts = env.VITE_ALLOWED_HOSTS
      ? env.VITE_ALLOWED_HOSTS.split(',').map(h => h.trim()).filter(Boolean)
      : [];

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts,
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.SERVER_URL': JSON.stringify(env.VITE_SERVER_URL),
        'process.env.WS_URL': JSON.stringify(env.VITE_WS_URL),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
