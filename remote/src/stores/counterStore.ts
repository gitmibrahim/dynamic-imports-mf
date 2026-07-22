import { defineStore } from 'pinia';

// Exposed via Module Federation. If `pinia: { singleton: true }` is actually
// enforced across the federation boundary, the host importing this store
// should see the SAME instance/state as the remote — not a duplicate.
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++;
    },
  },
});
