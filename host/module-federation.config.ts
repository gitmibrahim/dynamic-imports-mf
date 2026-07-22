import { createModuleFederationConfig } from '@module-federation/vite';
import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// Read remote URLs dynamically from public/runtime-config.json at build/dev time
const getRemoteEntryUrl = (): string => {
  try {
    const configPath = fileURLToPath(new URL('./public/runtime-config.json', import.meta.url));
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (config.REMOTE_APP_URL) {
        return config.REMOTE_APP_URL;
      }
    }
  } catch (err) {
    console.warn('[module-federation.config] Warning: Failed to read public/runtime-config.json for dynamic remote entry URL. Using fallback URL.', err);
  }
  return 'https://remote-app-3jn.pages.dev/remoteEntry.js'; // fallback
};

// FINDING (recorded during PoC build verification): an empty `remotes: {}`
// object is NOT enough. Rollup needs the remote NAME declared at build time
// or it tries to resolve `remoteApp/*` specifiers as real local modules and
// the build fails outright: "Rollup failed to resolve import 'remoteApp/...'"
// The URL resolved below serves as the build-time placeholder.
// registerRemotes() in src/main.ts overrides it at runtime with the value from public/runtime-config.json.
// This confirms the original design doc's Step 1 was correct: declare the
// name, leave/placeholder the entry, resolve the real URL at runtime.
export default createModuleFederationConfig({
  name: 'hostApp',
  remotes: {
    remoteApp: {
      type: 'module',
      name: 'remoteApp',
      entry: getRemoteEntryUrl(),
    },
  },
  shared: {
    vue: { singleton: true },
    pinia: { singleton: true },
  },
});

