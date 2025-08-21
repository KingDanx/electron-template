//? This file acts as a connection point between the frontend (loaded in a script tag in ./src/main.jsx) and the backend (../../index.js).
//? These functions are able to communicate to index.js because of the context bridge set up in ../../preload.js
//? These are the "REST" functions to trigger main process actions
//? Server functions are in ../../index.js and have the same name but snake case
//? Example: count() here is count() in ../index.js

export function count(number) {
  return new Promise((resolve, reject) => {
    console.log(number, "recieved value");
    window.ipcRenderer.send("count", { number: number });

    window.ipcRenderer.once("count", (response) => {
      try {
        console.log("count renderer: :", response);
        resolve(response);
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  });
}

export const windowAction = (action) => {
  window.ipcRenderer.send(action);
};
