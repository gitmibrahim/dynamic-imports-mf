<script setup lang="ts">
// Minimal on purpose — the point of this component is to prove federation
// wiring works, not to test UI. Uses the shared counter store so we can
// verify singleton state sharing across the federation boundary.
import { useCounterStore } from '../stores/counterStore';

const counter = useCounterStore();
</script>

<template>
  <button class="mf-remote-button" @click="counter.increment()">
    [remoteApp] Increment shared count — currently {{ counter.count }}
  </button>
</template>

<style scoped>
.mf-remote-button {
  padding: 10px 16px;
  border: 2px solid #42b883;
  background: #ecfdf5;
  color: #065f46;
  border-radius: 6px;
  cursor: pointer;
  font-family: monospace;
}
</style>
