import { createModuleFederationConfig } from '@module-federation/vite';

// FINDING (recorded during PoC build verification): an empty `remotes: {}`
// object is NOT enough. Rollup needs the remote NAME declared at build time
// or it tries to resolve `remoteApp/*` specifiers as real local modules and
// the build fails outright: "Rollup failed to resolve import 'remoteApp/...'"
// The URL below is a placeholder ONLY — registerRemotes() in src/main.ts
// overrides it at runtime with the value from public/runtime-config.json.
// This confirms the original design doc's Step 1 was correct: declare the
// name, leave/placeholder the entry, resolve the real URL at runtime.
export default createModuleFederationConfig({
  name: 'hostApp',
  remotes: {
    remoteApp: {
      type: 'module',
      name: 'remoteApp',
      entry: 'https://47eb43f0.remote-app-3jn.pages.dev/remoteEntry.js', // placeholder, overridden at runtime
    },
  },
  shared: {
    vue: { singleton: true },
    pinia: { singleton: true },
  },
});
