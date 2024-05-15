import { DefaultMantineColor, MantineProvider, MantineThemeOverride } from "@mantine/core";
import { createContext, useState } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

// const slate: MantineThemeOverride = {
//   fontFamily: "Roboto, Arial, sans-serif",
//   colorScheme: "dark",
//   colors: {
//     dark: [
//       "#C1C2C5",
//       "#A6A7AB",
//       "#909296",
//       "#5C5F66",
//       "#324363", // Card Borders
//       "#0d1830", // Layout edges
//       "#152847", // Card colors
//       "#0d1830", // Background of layout
//       "#070f2c", // Background
//       "#101113",
//     ],
//   },
//   other: {
//     charts: {
//       // Use DefaultMantineColor for the color
//       statsArea: {
//         cpu: "blue",
//         memory: "cyan",
//         swap: "red",
//         disk: "grape",
//       },
//     },
//   },
// };

// const shadcn: MantineThemeOverride = {
//   fontFamily: "Roboto, Arial, sans-serif",
//   colorScheme: "dark",
//   colors: {
//     dark: [
//       "#C1C2C5",
//       "#A6A7AB",
//       "#909296",
//       "#27272a",
//       "#27272a", // Card Borders
//       "#27272a", // Layout edges
//       "#09090b", // Card colors
//       "#09090b", // Background of layout
//       "#09090b", // Background
//       "#09090b",
//     ],
//   },
//   other: {
//     charts: {
//       // Use DefaultMantineColor for the color
//       statsArea: {
//         cpu: "white",
//         memory: "white",
//         swap: "white",
//         disk: "white",
//       },
//     },
//   },
// };

export enum THEME_OPTION {
  SLATE = "slate",
  SHADCN = "shadcn",
}

const themes: Record<THEME_OPTION, MantineThemeOverride> = {
  [THEME_OPTION.SLATE]: {
    fontFamily: "Roboto, Arial, sans-serif",
    colorScheme: "dark",
    colors: {
      dark: [
        "#C1C2C5",
        "#A6A7AB",
        "#909296",
        "#5C5F66",
        "#324363", // Card Borders
        "#0d1830", // Layout edges
        "#152847", // Card colors
        "#0d1830", // Background of layout
        "#070f2c", // Background
        "#101113",
      ],
    },
    other: {
      charts: {
        // Use DefaultMantineColor for the color
        statsArea: {
          cpu: "blue",
          memory: "cyan",
          swap: "red",
          disk: "grape",
        },
      },
    },
  },
  [THEME_OPTION.SHADCN]: {
    fontFamily: "Roboto, Arial, sans-serif",
    colorScheme: "dark",
    colors: {
      dark: [
        "#C1C2C5",
        "#A6A7AB",
        "#909296",
        "#27272a",
        "#27272a", // Card Borders
        "#27272a", // Layout edges
        "#09090b", // Card colors
        "#09090b", // Background of layout
        "#09090b", // Background
        "#09090b",
      ],
    },
    other: {
      charts: {
        // Use DefaultMantineColor for the color
        statsArea: {
          cpu: "white",
          memory: "white",
          swap: "white",
          disk: "white",
        },
      },
    },
  },
};
export const ThemeContext = createContext({
  theme: themes[THEME_OPTION.SLATE],
  currentTheme: THEME_OPTION.SLATE,
  setTheme: (theme: THEME_OPTION) => {},
});

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<MantineThemeOverride>(themes[THEME_OPTION.SLATE]);
  const [currentTheme, setCurrentTheme] = useState<THEME_OPTION>(THEME_OPTION.SLATE);

  const handleSetTheme = (theme: THEME_OPTION) => {
    setTheme(themes[theme]);
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, currentTheme }}>
      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
