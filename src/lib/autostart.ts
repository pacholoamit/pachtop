import { enable, isEnabled, disable } from "tauri-plugin-autostart-api";

export const enableAutostart = async () => {
  if (await isEnabled()) {
    return;
  }

  await enable();
};

export const disableAutostart = async () => {
  if (!(await isEnabled())) {
    return;
  }

  await disable();
};
