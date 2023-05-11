import { appConfigDir } from "@tauri-apps/api/path";
import { fs } from "@tauri-apps/api";

const configFileName = "config.json";

export const getCurrentUser = async () => {
  const configDir = await appConfigDir();
  const configFilePath = `${configDir}${configFileName}`;
  const config = await fs.readTextFile(configFilePath);
  return JSON.parse(config);
};
