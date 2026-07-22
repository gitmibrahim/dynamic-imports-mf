<script setup lang="ts">
// ── TEST 1: dynamic import — this is the CONFIRMED-working consumption
// pattern per the ecosystem evidence gathered before building this PoC.
import { defineAsyncComponent, ref } from 'vue';
const RemoteButtonAsync = defineAsyncComponent(() =>
  import('remoteApp/ExposedButton')
);

// ── TEST 2: literal static import — this is the UNCONFIRMED claim from the
// original doc. Uncomment the line below and remove TEST 1's dynamic wiring
// from the template if you want to test this in isolation. Left commented
// by default because if this line throws at module-eval time (before
// registerRemotes() has resolved), it will break TEST 1 as well, since
// this file is only reached via the deferred `import('./app')` in main.ts —
// so it SHOULD be safe to try. That itself is part of what you're testing.
//
// import RemoteButtonStatic from 'remoteApp/ExposedButton';

// ── TEST 3: shared Pinia store singleton check.
// If `pinia: { singleton: true }` is genuinely enforced across the
// federation boundary, incrementing here should be visible inside the
// remote's own button label too (both render the same store instance).
import { useCounterStore } from 'remoteApp/counterStore';
const hostCounter = useCounterStore();

const loadError = ref<string | null>(null);
</script>

<template>
  <div style="font-family: sans-serif; padding: 2rem; max-width: 640px">
    <h1>MF PoC — Host</h1>
    <p>
      Remote registered at runtime from <code>public/runtime-config.json</code>,
      not hardcoded in <code>vite.config.ts</code>.
    </p>

    <section style="margin-top: 1.5rem; padding: 1rem; border: 1px dashed #999">
      <h2>Test 1 — dynamic import (confirmed pattern)</h2>
      <Suspense>
        <template #default>
          <RemoteButtonAsync />
        </template>
        <template #fallback>
          <span>Loading remote…</span>
        </template>
      </Suspense>
    </section>

    <section style="margin-top: 1.5rem; padding: 1rem; border: 1px dashed #999">
      <h2>Test 2 — static import (uncomment in script block to test)</h2>
      <p style="color: #666">
        See comment above <code>RemoteButtonStatic</code> import — try it
        and record whether it throws, renders blank, or works.
      </p>
    </section>

    <section style="margin-top: 1.5rem; padding: 1rem; border: 1px dashed #999">
      <h2>Test 3 — shared store singleton check</h2>
      <p>
        Host-side view of shared count: <strong>{{ hostCounter.count }}</strong>
      </p>
      <button @click="hostCounter.increment()">
        [hostApp] Increment shared count
      </button>
      <p style="color: #666">
        Click this, then check if the remote's own button (Test 1, above)
        shows the same number. If not, singleton sharing isn't working.
      </p>
    </section>

    <p v-if="loadError" style="color: red">{{ loadError }}</p>
  </div>
</template>
