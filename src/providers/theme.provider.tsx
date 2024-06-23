// ThemeProvider.tsx

import { createContext, useEffect, useState } from "react";

import { DEFAULT_TITLEBAR_COLOR, THEME_OPTION, themes } from "@/contants";
import useEffectAsync from "@/hooks/useEffectAsync";
import useSettings from "@/hooks/useSettings";
import { setWindowColor } from "@/lib";
import store from "@/lib/store";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeContextType {
  setTheme: (theme: THEME_OPTION) => void;
  isMidnight: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  setTheme: () => {},
  isMidnight: true,
});

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { settings, setTheme: setStoreTheme } = useSettings();

  const [theme, setTheme] = useState<MantineThemeOverride>(themes[THEME_OPTION.MIDNIGHT]);
  const [isMidnight, setIsMidnight] = useState<boolean>(true);

  useEffectAsync(async () => {
    handleSetTheme(settings.theme);
  }, [settings.theme]);

  const handleSetTheme = async (theme: THEME_OPTION) => {
    setTheme(themes[theme]);
    await setStoreTheme(theme);
    setIsMidnight(settings.theme === THEME_OPTION.MIDNIGHT);
  };

  return (
    <ThemeContext.Provider value={{ setTheme: handleSetTheme, isMidnight }}>
      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
