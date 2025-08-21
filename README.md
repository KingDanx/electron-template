# Electron Template

A minimal Electron application template with a separated frontend inside `src/frontend`.

> **Quick note:** This README explains how to install dependencies for both the root (Electron host) and the frontend (web app inside `src/frontend`), how to run the development environments, and what `npm run package` and `npm run make` typically do when using `electron-forge`.

---

## Requirements

- Node.js (recommended: active LTS — e.g. Node 16+ or newer)
- npm (comes with Node.js) or yarn (you can use yarn if you prefer)
- git (to clone the repository)

> If you need to check your Node/npm versions:

```bash
node -v
npm -v
```

---

## Getting started

1. Clone the repository:

```bash
git clone https://github.com/KingDanx/electron-template.git
cd electron-template
```

2. Install root dependencies:

```bash
# from repository root
npm install
```

3. Install frontend dependencies:

```bash
cd src/frontend
npm install
```

> **Why both installs?**  
> This repo separates the Electron host (root) from the frontend (a separate web app in `src/frontend`). Each has its own `package.json` and dependency tree, so you must install packages in both locations.

---

## Development

### Start the frontend dev server

Open a terminal in the frontend folder and run:

```bash
cd src/frontend
npm run dev
```

### Start the Electron dev environment

Open a terminal in the **project root** and run:

```bash
npm start
```

This typically starts the Electron process and loads the app. If the project is wired with a separate frontend dev server, it often expects that frontend to already be running (see below).

This usually starts a web dev server (Vite, webpack-dev-server, CRA, etc.) and serves the frontend assets with hot reload. Leave this running while working on frontend code.

> Typical workflow:
>
> - In one terminal: `cd src/frontend && npm run dev` (frontend hot-reload server)
> - In another terminal: `npm start` (Electron host that loads the frontend, often via `http://localhost:5173` or a similar URL)

---

## Packaging & Making distributables

This template includes scripts to package and make installers/artifacts. The exact behavior depends on the `package.json` scripts and the `forge.config.js` (or other tooling) configured in the project. Below are the typical meanings when using **electron-forge**:

### `npm run package`

`npm run package` typically runs `electron-forge package`. This performs a packaging step that bundles your app into a platform-specific folder — a packaged application (app folder) that contains the Electron runtime and your app files. It does **not** create an installer; it produces a packaged app that you could distribute or test (for example, an `.app` directory on macOS or an unpacked Windows app folder).

What to expect:

- Output folder (commonly something like `out/` or `out/package/`) with the packaged application.
- Good for testing the packaged binary locally before making installers.

### `npm run make`

`npm run make` typically runs `electron-forge make`. This step generates platform-specific distributables/installers (like `.dmg` or `.zip` on macOS, `.exe` or `.msi` on Windows, and `.deb` or `.AppImage` on Linux), depending on the makers configured in `forge.config.js`. `make` uses the packaged app as input and produces installer artifacts.

What to expect:

- Output folder (commonly `out/make` or `out/`) containing the final installer files.
- Requires platform-specific maker configuration (check `forge.config.js`)
- Some makers have native dependencies or extra tooling (e.g., `electron-wix-msi` on Windows may require WiX Toolset installed)

> **Note:** If you plan to run `npm run make` for a platform different from your current OS (e.g., making Windows installers on macOS), you may need cross-compilation tooling or to run the command on the target platform/CI with appropriate makers configured.

---

## Useful tips & troubleshooting

- If the frontend is not reachable from Electron when you run `npm start`, ensure the frontend dev server is running and note the URL/port it serves on (often `http://localhost:5173`).
- If native modules cause issues when packaging, you may need to rebuild them for Electron (e.g., `electron-rebuild`) or configure `electron-rebuild`/`postinstall` hooks.
- Inspect `forge.config.js` to see what makers are enabled and how packaging/making is configured.
- If `npm run package` or `npm run make` fail with permission or missing tool errors, read the error messages — you might be missing platform-specific tools (e.g., WiX on Windows for some installers).

---

## Project structure (high level)

```
/
├─ package.json            # root, electron host, scripts: start, package, make, ...
├─ forge.config.js         # electron-forge configuration (makers, packager options)
├─ src/
│  ├─ index.js             # electron main process code
│  ├─ preload.js           # electron/frontend context bridge
│  └─ logs/                # log files placed here. Info: https://github.com/KingDanx/LiteLogger
│  └─ temp/                # temporary files can be placed here. purged at app boot
│  └─ frontend/            # web frontend (separate package.json)
│     └─ src/
│     └─ package.json
│     └─ renderer.js       # functions that can be called in the frontend linked to preload.js
└─ README.md
```

---

## License

This repository uses the MIT License. See `LICENSE` for details.

---
