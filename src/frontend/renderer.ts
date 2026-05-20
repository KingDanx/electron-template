//? This file acts as a connection point between the frontend (loaded in a script tag in ./src/main.tsx) and the backend (../../index.ts).
//? These functions are able to communicate to index.ts because of the context bridge set up in ../../preload.ts
//? These are the "REST" functions to trigger main process actions
//? Server functions are in ../../index.ts and have the same name but snake case
//? Example: count() here is count() in ../index.ts

export function count(number: number) {
  return window.api.count(number);
}

export const windowAction = (action: string) => {
  window.ipcRenderer.send(action);
};
