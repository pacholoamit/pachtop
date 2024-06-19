import { createContext, useState } from "react";

import useEffectAsync from "@/hooks/useEffectAsync";
import store from "@/lib/store";

interface SettingsProviderProps {
  children: React.ReactNode;
}

interface SettingsContextType {
  isPerformanceModeEnabled: boolean;
  togglePerformanceMode: () => void;
}

export const SettingsContext = createContext<SettingsContextType>({
  isPerformanceModeEnabled: false,
  togglePerformanceMode: () => {},
});

const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [isPerformanceModeEnabled, setIsPerformanceModeEnabled] = useState(false);

  const togglePerformanceMode = async () => {
    const currentStore = await store;
    const isEnabled = await currentStore.isPerformanceModeEnabled.get();
    await currentStore.isPerformanceModeEnabled.set(!isEnabled);
    setIsPerformanceModeEnabled(!isEnabled);
  };

  useEffectAsync(async () => {
    const currentStore = await store;

    const isPerformanceModeEnabled = await currentStore.isPerformanceModeEnabled.get();
    setIsPerformanceModeEnabled(isPerformanceModeEnabled);
  }, []);
  return (
    <SettingsContext.Provider
      value={{
        isPerformanceModeEnabled,
        togglePerformanceMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
