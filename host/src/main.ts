import { registerRemotes } from '@module-federation/enhanced/runtime';

// This is the file under test. Everything downstream (App.vue and its
// federated imports) must NOT be imported at the top level of this file —
// only inside the dynamic import() below, after registerRemotes() resolves.
// See PHASE 3 checklist item 5: calling bootstrap() twice should be guarded.

let hasBootstrapped = false;

async function bootstrap() {
  if (hasBootstrapped) {
    console.warn('[mf-poc] bootstrap() called again — skipping duplicate registerRemotes()');
    return;
  }
  hasBootstrapped = true;

  const res = await fetch('/runtime-config.json');
  const config = await res.json();

  registerRemotes([
    {
      name: 'remoteApp',
      entry: config.REMOTE_APP_URL,
      type: 'module',
    },
  ]);

  // IMPORTANT: dynamic import, evaluated only after registration above.
  // A static `import './app'` at the top of this file would defeat the
  // whole pattern — it would execute before registerRemotes() runs.
  await import('./app');
}

bootstrap();

// Exposed on window purely so PHASE 3 item 5 (double-registration test) can
// be triggered manually from devtools: window.__mfPocRebootstrap()
(window as any).__mfPocRebootstrap = bootstrap;
