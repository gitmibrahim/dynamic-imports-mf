import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import { federation } from '@module-federation/vite';
// import mfConfig from './module-federation.config';

export default defineConfig({
  plugins: [
    vue(),
    // federation(mfConfig)
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'chrome89',
  },
});
