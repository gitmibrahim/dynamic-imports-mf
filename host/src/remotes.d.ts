// Ambient declarations for the federated remote. Needed because the remote's
// source isn't physically present in this project — TypeScript can't infer
// these otherwise. See the "dts" note in the accompanying README for how to
// replace this with auto-generated types once you're past PoC stage.

declare module 'remoteApp/ExposedButton' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}

declare module 'remoteApp/counterStore' {
  export const useCounterStore: () => {
    count: number;
    increment: () => void;
  };
}
