export {};

declare global {
  interface Window {
    ipcRenderer: {
      send: (channel: string, data?: unknown) => void;
      on: (channel: string, fn: (...args: unknown[]) => void) => void;
      once: (channel: string, fn: (...args: unknown[]) => void) => void;
    };

    api: {
      count: (number: number) => void;
    };
  }
}
