import { createContext, useState } from "react";

import useEffectAsync from "@/hooks/useEffectAsync";
import { autostart } from "@/lib";
import logger from "@/lib/logger";
import store from "@/lib/store";

interface SettingsProviderProps {
  children: React.ReactNode;
}

interface SettingsContextType {
  settings: SettingsSchema;
  toggleAutoStart: () => Promise<void>;
  togglePerformanceMode: () => void;
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: {
    isAutoStartEnabled: false,
    isPerformanceModeEnabled: false,
  },
  togglePerformanceMode: () => {},
  toggleAutoStart: async () => {},
});

interface SettingsSchema {
  isPerformanceModeEnabled: boolean;
  isAutoStartEnabled: boolean;
}

const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsSchema>({
    isPerformanceModeEnabled: false,
    isAutoStartEnabled: false,
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

  useEffectAsync(async () => {
    const currentStore = await store;

    const isPerformanceModeEnabled = await currentStore.isPerformanceModeEnabled.get();
    const isAutoStartEnabled = await autostart.isEnabled();

    setSettings({
      isPerformanceModeEnabled,
      isAutoStartEnabled,
    });
  }, []);
  return (
    <SettingsContext.Provider
      value={{
        settings,
        togglePerformanceMode,
        toggleAutoStart,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
