<script setup lang="ts">
// This is ONLY for running the remote standalone (npm run dev) to sanity-check
// it works before the host ever consumes it. It is NOT what gets exposed —
// see module-federation.config.ts `exposes` for the actual federated surface.
import ExposedButton from './components/ExposedButton.vue';
</script>

<template>
  <div style="font-family: sans-serif; padding: 2rem">
    <h1>Remote App (standalone mode)</h1>
    <p>This page is just for verifying the remote works before federation.</p>
    <ExposedButton />
  </div>
</template>
