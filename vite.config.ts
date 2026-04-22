import { defineConfig, loadEnv, type UserConfigExport } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
// eslint-disable-next-line
const config: UserConfigExport = ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react(), svgrPlugin(), viteTsconfigPaths()],
    base: process.env.VITE_BASE_PATH,
    server: {
      port: Number(process.env.VITE_PORT) || 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: process.env.VITE_PROXY_URL,
          changeOrigin: true,
          secure: false,
        },
        '/socket.io': {
          target: process.env.VITE_PROXY_URL,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
      allowedHosts: true,
    },
    build: {
      outDir: 'build',
      sourcemap: false,
      rollupOptions: {
        input: {
          main: './index.html',
        },
        output: {
          manualChunks: {
            antd: ['react', 'antd', '@ant-design/cssinjs'],
            i18n: ['i18next', 'react-i18next'],
            tailwind: ['tailwindcss'],
            exceljs: ['exceljs'],
            pdfjs: ['pdfjs-dist'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['pdfjs-dist'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
  });
};

export default config;
