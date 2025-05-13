import path from "path";
import { pathToFileURL } from "url";

export async function loadConfig() {
  const configPath = path.resolve(process.cwd(), "jido.config.js");

  try {
    const config = await import(pathToFileURL(configPath).href);
    return config.default;
  } catch (e) {
    throw new Error(`Failed to load jido.config.js: ${e}`);
  }
}

