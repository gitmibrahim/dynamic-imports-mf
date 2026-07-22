import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { federation } from '@module-federation/vite';
import mfConfig from './module-federation.config';

// PoC remote — deliberately fixed port so the host has a stable URL
// to register at runtime (see host/public/runtime-config.json).
export default defineConfig({
  plugins: [vue(), federation(mfConfig)],
  server: {
    port: 5001,
    origin: 'http://localhost:5001',
    cors: true,
  },
  preview: {
    port: 5001,
    cors: true,
  },
  build: {
    target: 'chrome89',
    modulePreload: false,
  },
});
