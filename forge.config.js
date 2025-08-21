import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

export default {
  packagerConfig: {
    asar: true,
    icon: "./icon/icon", // Forge will pick icon.ico for Windows, icon.icns for macOS, and icon.png for Linux
    extraResource: ["./src/logs", "./src/temp", "./src/frontend/dist"],
  },
  rebuildConfig: {},
  makers: [
    // Windows (Squirrel)
    {
      name: "@electron-forge/maker-squirrel",
      platforms: ["win32"],
      config: {
        name: "electron_template",
        authors: "Dan Prudhomme Jr",
        description: "A basic template for other projects to use",
      },
    },
    // macOS
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    // Linux: DEB
    {
      name: "@electron-forge/maker-deb",
      platforms: ["linux"],
      config: {
        options: {
          maintainer: "Dan Prudhomme Jr",
          homepage: "https://github.com/KingDanx/electron-template",
          icon: "./icon/icon.png",
          categories: ["Utility"],
        },
      },
    },
    // Linux: RPM
    {
      name: "@electron-forge/maker-rpm",
      platforms: ["linux"],
      config: {
        options: {
          maintainer: "Dan Prudhomme Jr",
          homepage: "https://github.com/KingDanx/electron-template",
          icon: "./icon/icon.png",
          categories: ["Utility"],
        },
      },
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    // Fuses
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
