// ThemeProvider.tsx

import { createContext, useEffect, useState } from "react";

import { DEFAULT_TITLEBAR_COLOR, THEME_OPTION, themes } from "@/contants";
import { setWindowColor } from "@/lib";
import store from "@/lib/store";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeContextType {
  currentTheme: THEME_OPTION;
  setTheme: (theme: THEME_OPTION) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: THEME_OPTION.SLATE,
  setTheme: () => {},
});

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<MantineThemeOverride>(themes[THEME_OPTION.SLATE]);
  const [currentTheme, setCurrentTheme] = useState<THEME_OPTION>(THEME_OPTION.SLATE);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await store.theme.get();
      if (storedTheme && themes[storedTheme as THEME_OPTION]) {
        handleSetTheme(storedTheme as THEME_OPTION);
      } else {
        handleSetTheme(THEME_OPTION.SLATE);
      }
    };
    loadTheme();
  }, []);

  const handleSetTheme = (theme: THEME_OPTION) => {
    setTheme(themes[theme]);
    setCurrentTheme(theme);
    setWindowColor(themes[theme]?.other?.titlebar || DEFAULT_TITLEBAR_COLOR);
    store.theme.set(theme);
    store.windowColor.set(themes[theme]?.other?.titlebar || DEFAULT_TITLEBAR_COLOR);
  };

  return (
    <ThemeContext.Provider value={{ setTheme: handleSetTheme, currentTheme }}>
      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
