// ThemeProvider.tsx

import { createContext, useEffect, useState } from "react";

import { DEFAULT_TITLEBAR_COLOR, THEME_OPTION, themes } from "@/contants";
import useEffectAsync from "@/hooks/useEffectAsync";
import { setWindowColor } from "@/lib";
import store from "@/lib/store";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeContextType {
  currentTheme: THEME_OPTION;
  setTheme: (theme: THEME_OPTION) => void;
  isMidnight: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: THEME_OPTION.SLATE,
  setTheme: () => {},
  isMidnight: true,
});

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<MantineThemeOverride>(themes[THEME_OPTION.MIDNIGHT]);
  const [currentTheme, setCurrentTheme] = useState<THEME_OPTION>(THEME_OPTION.MIDNIGHT);
  const [isMidnight, setIsMidnight] = useState<boolean>(true);

  useEffectAsync(async () => {
    const storedTheme = await store.then((s) => s.theme.get());
    if (storedTheme && themes[storedTheme as THEME_OPTION]) {
      return handleSetTheme(storedTheme as THEME_OPTION);
    }
    handleSetTheme(currentTheme);
  }, [currentTheme]);

  const handleSetTheme = async (theme: THEME_OPTION) => {
    const appStore = await store;
    setTheme(themes[theme]);
    setCurrentTheme(theme);
    setWindowColor(themes[theme]?.other?.titlebar || DEFAULT_TITLEBAR_COLOR);
    appStore.theme.set(theme);
    appStore.windowColor.set(themes[theme]?.other?.titlebar || DEFAULT_TITLEBAR_COLOR);
    setIsMidnight(currentTheme === THEME_OPTION.MIDNIGHT);
  };

  return (
    <ThemeContext.Provider value={{ setTheme: handleSetTheme, currentTheme, isMidnight }}>
      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
