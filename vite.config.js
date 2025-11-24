import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

// Block access to sensitive files in dev mode
function blockSensitiveFiles() {
  const blockedPatterns = [
    /emails\.csv$/i,
    /\.env$/i,
    /package\.json$/i,
    /package-lock\.json$/i,
    /server\.js$/i,
    /server\.config\.js$/i,
  ];

  return {
    name: 'block-sensitive-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] || '';

        if (blockedPatterns.some(pattern => pattern.test(url))) {
          // Serve index.html with 404 status so React Router shows NotFound page
          // This matches the response for actually non-existent pages
          const indexPath = path.resolve(__dirname, 'index.html');
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html');
          fs.createReadStream(indexPath).pipe(res);
          return;
        }

        next();
      });
    }
  };
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  plugins: [react(), tailwindcss(), blockSensitiveFiles()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  build: {
    outDir: 'dist'
  }
});
