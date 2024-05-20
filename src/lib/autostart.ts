import { disable, enable, isEnabled } from 'tauri-plugin-autostart-api';

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

export const autostart = {
  enable: enableAutostart,
  disable: disableAutostart,
  isEnabled,
};
