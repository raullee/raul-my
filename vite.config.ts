import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Plugin to serve static HTML files from public directory
function staticHtmlPlugin(): Plugin {
  return {
    name: 'static-html-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        // Check if URL ends with / and has a matching index.html in public
        if (url.endsWith('/') && url !== '/') {
          const publicPath = path.join(__dirname, 'public', url, 'index.html');
          if (fs.existsSync(publicPath)) {
            req.url = url + 'index.html';
          }
        }
        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', 'VITE_');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [staticHtmlPlugin(), react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
