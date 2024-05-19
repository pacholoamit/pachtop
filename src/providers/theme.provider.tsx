import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import { createContext, useEffect, useState } from "react";
import { setWindowColor } from "@/lib";
import store from "@/lib/store";
import { DEFAULT_TITLEBAR_COLOR } from "@/contants";
import "non.geist";
import "non.geist/mono";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export enum THEME_OPTION {
  SLATE = "slate",
  MIDNIGHT = "midnight",
  BUMBLEBEE = "bumblebee",
}

export const themes: Record<THEME_OPTION, MantineThemeOverride> = {
  [THEME_OPTION.SLATE]: {
    fontFamily: "Geist Variable, Roboto, Arial, sans-serif",
    colorScheme: "dark",
    colors: {
      dark: [
        "#C1C2C5",
        "#A6A7AB",
        "#909296",
        "#5C5F66",
        "#324363", // Card Borders
        "#324363", // Layout edges
        "#152847", // Card colors
        "#0d1830", // Background of layout
        "#0d1830", // Background
        "#101113",
      ],
    },
    other: {
      titlebar: "#0d1830",
      charts: {
        // Use DefaultMantineColor for the color
        statsRing: {
          cpu: "blue",
          memory: "cyan",
          swap: "red",
          disk: "grape",
        },
        area: {
          default: {
            // This is the rectangle box that u can use to navigate
            navigator: {
              handles: {
                backgroundColor: "white",
              },
              // This is the mask that covers the area
              maskFill: "rgba(255, 255, 255, 0.2)",
            },

            gridLineColor: "#263858",
            lineColor: "#263858",
            labelColor: "#8192ac",
            tooltip: {
              color: "#dce1e8",
              backgroundColor: "#263858",
            },
            scrollbar: {
              rifleColor: "#324363",
              barBackgroundColor: "#324363",
              buttonBackgroundColor: "#324363",
              trackBorderColor: "#324363",
            },
            rangeSelector: {
              labelStyle: {
                color: "#8192ac",
                backgroundColor: "#263858",
              },

              inputStyle: {
                color: "#8192ac",
              },
            },
            buttonTheme: {
              style: {
                color: "#8192ac",
                backgroundColor: "#263858",
              },
            },
            legend: {
              color: "#dce1e8",
            },
          },
          swap: {
            color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, "rgba(53, 162, 235, 1)"],
                [1, "rgba(53, 162, 235, 0.45)"],
              ],
            },
          },
          networkReceived: {
            color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, "rgb(236, 18, 120,1)"],
                [1, "rgb(236, 18, 120, 0.45)"],
              ],
            },
          },
          networksTransmitted: {
            color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, "rgb(252, 169, 46,1)"],
                [1, "rgb(252, 169, 46, 0.45)"],
              ],
            },
          },
          memory: {
            color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, "rgba(10, 167, 147, 1)"],
                [1, "rgba(10, 167, 147, 0.45)"],
              ],
            },
          },
          globalCpu: {
            color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, "rgba(255, 99, 132, 1)"],
                [1, "rgba(255, 99, 132, 0.45)"],
              ],
            },
          },
        },
        bar: {
          cpus: {
            colors: ["#7B2EDA"],
          },
        },
      },
    },
  },
  [THEME_OPTION.MIDNIGHT]: {
    fontFamily: "Geist Variable, Roboto, Arial, sans-serif",
    colorScheme: "dark",
    primaryColor: "gray",
    colors: {
      dark: [
        "#C1C2C5",
        "#A6A7AB",
        "#909296",
        "#27272a",
        "#27272a", // Card Borders
        "#27272a", // Layout edges
        "#0a0a0a", // Card colors
        "#09090b", // Background of layout
        "#09090b", // Background
        "#09090b",
      ],
    },
    other: {
      titlebar: "#09090b",
      charts: {
        // Use DefaultMantineColor for the color
        statsRing: {
          cpu: "white",
          memory: "white",
          swap: "white",
          disk: "white",
        },
        area: {
          default: {
            // This is the rectangle box that u can use to navigate
            navigator: {
              handles: {
                backgroundColor: "white",
              },
              // This is the mask that covers the area
              maskFill: "rgba(255, 255, 255, 0.2)",
            },
            gridLineColor: "#27272a",
            lineColor: "#27272a",
            labelColor: "white",
            tooltip: {
              color: "#dce1e8",
              backgroundColor: "#09090b",
            },
            scrollbar: {
              rifleColor: "#27272a",
              barBackgroundColor: "#27272a",
              buttonBackgroundColor: "#27272a",
              trackBorderColor: "#27272a",
            },
            rangeSelector: {
              labelStyle: {
                color: "white",
                backgroundColor: "#27272a",
              },

              inputStyle: {
                color: "white",
              },
            },
            buttonTheme: {
              style: {
                color: "white",
                backgroundColor: "#27272a",
              },
            },
            legend: {
              color: "#dce1e8",
            },
          },
          swap: {
            color: "white",
          },
          networkReceived: {
            color: "white", // Make it random
          },
          networksTransmitted: {
            color: "white",
          },
          memory: {
            color: "white",
          },
          globalCpu: {
            color: "white",
          },
        },
        bar: {
          cpus: {
            colors: ["#FFFFFF"],
          },
        },
      },
    },
  },
  [THEME_OPTION.BUMBLEBEE]: {
    fontFamily: "Geist Variable, Roboto, Arial, sans-serif",
    colorScheme: "dark",
    primaryColor: "yellow",
    colors: {
      dark: [
        "#C1C2C5",
        "#A6A7AB",
        "#909296",
        "#27272a",
        "#27272a", // Card Borders
        "#27272a", // Layout edges
        "#0a0a0a", // Card colors
        "#09090b", // Background of layout
        "#09090b", // Background
        "#09090b",
      ],
    },
    other: {
      titlebar: "#09090b",
      charts: {
        // Use DefaultMantineColor for the color
        statsRing: {
          cpu: "yellow",
          memory: "yellow",
          swap: "yellow",
          disk: "yellow",
        },
        area: {
          default: {
            // This is the rectangle box that u can use to navigate
            navigator: {
              handles: {
                backgroundColor: "white",
              },
              // This is the mask that covers the area
              maskFill: "rgba(255, 255, 255, 0.1)",
            },

            gridLineColor: "#27272a",
            lineColor: "#27272a",
            labelColor: "white",
            tooltip: {
              color: "#dce1e8",
              backgroundColor: "#09090b",
            },
            scrollbar: {
              rifleColor: "#27272a",
              barBackgroundColor: "#27272a",
              buttonBackgroundColor: "#27272a",
              trackBorderColor: "#27272a",
            },
            rangeSelector: {
              labelStyle: {
                color: "white",
                backgroundColor: "#27272a",
              },

              inputStyle: {
                color: "white",
              },
            },
            buttonTheme: {
              style: {
                color: "white",
                backgroundColor: "#27272a",
              },
            },
            legend: {
              color: "#dce1e8",
            },
          },
          swap: {
            color: "#fdd450",
          },
          networkReceived: {
            color: "#fdd450", // Make it random
          },
          networksTransmitted: {
            color: "#fdd450",
          },
          memory: {
            color: "#fdd450",
          },
          globalCpu: {
            color: "#fdd450",
          },
        },
        bar: {
          cpus: {
            colors: ["#fdd450"],
          },
        },
      },
    },
  },
};
export const ThemeContext = createContext({
  currentTheme: THEME_OPTION.SLATE,
  setTheme: (theme: THEME_OPTION) => {},
});

// Todo implement in settingsprovider?
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<MantineThemeOverride>(themes[THEME_OPTION.SLATE]);
  const [currentTheme, setCurrentTheme] = useState<THEME_OPTION>(THEME_OPTION.SLATE);

  useEffect(() => {
    store.theme.get().then((theme) => {
      if (theme) {
        setTheme(themes[theme as THEME_OPTION]);
        setCurrentTheme(theme as THEME_OPTION);
        setWindowColor(themes[theme as THEME_OPTION]?.other?.titlebar || DEFAULT_TITLEBAR_COLOR);
      }
    });
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
