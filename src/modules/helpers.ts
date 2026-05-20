import path from "path";
import isDev from "electron-is-dev";

export function getResourcePath(resourceRelativePath?: string | undefined) {
  if (isDev) {
    if (resourceRelativePath) {
      return path.join(import.meta.dirname, resourceRelativePath);
    }
    return path.join(import.meta.dirname);
  }
  if (resourceRelativePath) {
    return path.join(process.resourcesPath, resourceRelativePath);
  }
  return process.resourcesPath;
}
