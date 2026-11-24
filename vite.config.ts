import angular from '@analogjs/vite-plugin-angular';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';

function disableViteClientWsPlugin(): Plugin {
  return {
    name: 'disable-vite-client-websocket',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use('/@vite/client', (_req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.end(`
export function createHotContext() {
  return {
    accept() {},
    dispose() {},
    prune() {},
    invalidate() {},
    on() {},
    off() {},
    send() {},
  };
}
export function updateStyle(id, content) {
  let style = document.querySelector('style[data-vite-dev-id="' + id + '"]');
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('data-vite-dev-id', id);
    document.head.appendChild(style);
  }
  style.textContent = content;
}
export function removeStyle(id) {
  const style = document.querySelector('style[data-vite-dev-id="' + id + '"]');
  if (style) style.remove();
}
export function injectQuery(url) { return url; }
`);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      disableViteClientWsPlugin(),
      angular({
        tsconfig: path.resolve(__dirname, 'tsconfig.app.json'),
        liveReload: false,
      }),
      tailwindcss(),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: false,
      ws: false,
    },
  };
});
