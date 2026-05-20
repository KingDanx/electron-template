"use strict";var{contextBridge:c,ipcRenderer:o}=require("electron");c.exposeInMainWorld("ipcRenderer",{send:(e,n)=>o.send(e,n),on:(e,n)=>o.on(e,(i,...r)=>n(...r)),once:(e,n)=>o.once(e,(i,...r)=>n(...r))});c.exposeInMainWorld("api",{count:e=>o.invoke("count",e)});
//! This must be CommonJS for some reason.
