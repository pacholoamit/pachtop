import { createContext, useState } from 'react';

import { DEFAULT_TITLEBAR_COLOR, THEME_OPTION, themes } from '@/contants';
import useEffectAsync from '@/hooks/useEffectAsync';
import { autostart, setWindowColor } from '@/lib';
import logger from '@/lib/logger';
import store from '@/lib/store';

interface SettingsProviderProps {
  children: React.ReactNode;
}

interface SettingsContextType {
  settings: SettingsSchema;
  toggleAutoStart: () => Promise<void>;
  togglePerformanceMode: () => void;
  setTheme: (theme: THEME_OPTION) => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: {
    isAutoStartEnabled: false,
    isPerformanceModeEnabled: false,
    theme: THEME_OPTION.MIDNIGHT,
  },
  setTheme: async () => {},
  togglePerformanceMode: () => {},
  toggleAutoStart: async () => {},
});

interface SettingsSchema {
  theme: THEME_OPTION;
  isPerformanceModeEnabled: boolean;
  isAutoStartEnabled: boolean;
}

const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsSchema>({
    isPerformanceModeEnabled: false,
    isAutoStartEnabled: false,
    theme: THEME_OPTION.MIDNIGHT,
  });

  const togglePerformanceMode = async () => {
    const currentStore = await store;
    const isEnabled = await currentStore.isPerformanceModeEnabled.get();
    await currentStore.isPerformanceModeEnabled.set(!isEnabled);

    setSettings((prev) => ({
      ...prev,
      isPerformanceModeEnabled: !isEnabled,
    }));
  };

  const toggleAutoStart = async () => {
    if (settings.isAutoStartEnabled) {
      await autostart.disable();
    } else {
      await autostart.enable();
    }
    logger.info(`Auto start is now ${!settings.isAutoStartEnabled ? "enabled" : "disabled"}`);

    setSettings((prev) => ({
      ...prev,
      isAutoStartEnabled: !prev.isAutoStartEnabled,
    }));
  };

  const setTheme = async (theme: THEME_OPTION) => {
    const newTheme = validateTheme(theme);
    const currentStore = await store;
    
    await currentStore.theme.set(newTheme);
    await setWindowColor(themes[newTheme]?.other?.titlebar || DEFAULT_TITLEBAR_COLOR);
    await currentStore.windowColor.set(themes[newTheme]?.other?.titlebar || DEFAULT_TITLEBAR_COLOR);

    setSettings((prev) => ({
      ...prev,
      theme,
    }));
  };

  // Handle invalid theme
  const validateTheme = (theme: string) => {
    if (themes[theme as THEME_OPTION]) return theme as THEME_OPTION;
    return THEME_OPTION.MIDNIGHT;
  };

  useEffectAsync(async () => {
    const currentStore = await store;
    const isPerformanceModeEnabled = await currentStore.isPerformanceModeEnabled.get();
    const isAutoStartEnabled = await autostart.isEnabled();
    const theme = validateTheme(await currentStore.theme.get());

    setSettings({
      isPerformanceModeEnabled,
      isAutoStartEnabled,
      theme,
    });
  }, []);
  return (
    <SettingsContext.Provider
      value={{
        settings,
        togglePerformanceMode,
        toggleAutoStart,
        setTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
