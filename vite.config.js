import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const firebaseProjectId = env.VITE_FIREBASE_PROJECT_ID || 'ai-crowd-intelligence';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5001',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, `/${firebaseProjectId}/us-central1`),
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/tests/setup.js',
    },
  };
});
