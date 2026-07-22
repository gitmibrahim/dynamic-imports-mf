import { createModuleFederationConfig } from '@module-federation/vite';

export default createModuleFederationConfig({
  name: 'remoteApp',
  filename: 'remoteEntry.js',
  exposes: {
    './ExposedButton': './src/components/ExposedButton.vue',
    './counterStore': './src/stores/counterStore.ts',
  },
  shared: {
    vue: { singleton: true },
    pinia: { singleton: true },
  },
});
