//! This must be CommonJS for some reason.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipcRenderer", {
  /**
   *
   * @param {string} channel
   * @param {unknown} data
   */
  send: (channel, data) => ipcRenderer.send(channel, data),

  /**
   *
   * @param {string} channel
   * @param {(...args: unknown[]) => void} fn
   */
  on: (channel, fn) =>
    ipcRenderer.on(channel, (_event, ...args) => fn(...args)),

  /**
   *
   * @param {string} channel
   * @param {(...args: unknown[]) => void} fn
   */
  once: (channel, fn) =>
    ipcRenderer.once(channel, (_event, ...args) => fn(...args)),
});

contextBridge.exposeInMainWorld("api", {
  /**
   *
   * @param {number} number
   * @returns {number}
   */
  count: (number) => ipcRenderer.invoke("count", number),
});
