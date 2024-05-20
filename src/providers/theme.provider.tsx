import 'non.geist';
import 'non.geist/mono';

import { createContext, useEffect, useState } from 'react';

import { DEFAULT_TITLEBAR_COLOR } from '@/contants';
import { setWindowColor } from '@/lib';
import store from '@/lib/store';
import { MantineProvider, MantineThemeOverride } from '@mantine/core';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export enum THEME_OPTION {
  SLATE = "slate",
  MIDNIGHT = "midnight",
  BUMBLEBEE = "bumblebee",
}

const commonColors = {
  slate: {
    cardBorder: "#324363",
    layoutEdge: "#324363",
    cardColor: "#152847",
    background: "#0d1830",
    gridLine: "#263858",
    label: "#8192ac",
    scrollbar: "#324363",
    tooltipBg: "#263858",
    titlebar: "#0d1830",
    legend: "#dce1e8",
  },
  midnight: {
    cardBorder: "#27272a",
    layoutEdge: "#27272a",
    cardColor: "#0a0a0a",
    background: "#09090b",
    gridLine: "#27272a",
    label: "white",
    scrollbar: "#27272a",
    tooltipBg: "#09090b",
    titlebar: "#09090b",
    legend: "#dce1e8",
  },
  bumblebee: {
    cardBorder: "#27272a",
    layoutEdge: "#27272a",
    cardColor: "#0a0a0a",
    background: "#09090b",
    gridLine: "#27272a",
    label: "white",
    scrollbar: "#27272a",
    tooltipBg: "#09090b",
    titlebar: "#09090b",
    legend: "#dce1e8",
    yellow: "#fdd450",
  },
};

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
        commonColors.slate.cardBorder, // Card Borders
        commonColors.slate.layoutEdge, // Layout edges
        commonColors.slate.cardColor, // Card colors
        commonColors.slate.background, // Background of layout
        commonColors.slate.background, // Background
        "#101113",
      ],
    },
    other: {
      titlebar: commonColors.slate.titlebar,
      charts: {
        statsRing: {
          cpu: "blue",
          memory: "cyan",
          swap: "red",
          disk: "grape",
        },
        area: {
          default: {
            navigator: {
              handles: {
                backgroundColor: "white",
              },
              maskFill: "rgba(255, 255, 255, 0.2)",
            },
            gridLineColor: commonColors.slate.gridLine,
            lineColor: commonColors.slate.gridLine,
            labelColor: commonColors.slate.label,
            tooltip: {
              color: commonColors.slate.legend,
              backgroundColor: commonColors.slate.tooltipBg,
            },
            scrollbar: {
              rifleColor: commonColors.slate.scrollbar,
              barBackgroundColor: commonColors.slate.scrollbar,
              buttonBackgroundColor: commonColors.slate.scrollbar,
              trackBorderColor: commonColors.slate.scrollbar,
            },
            rangeSelector: {
              labelStyle: {
                color: commonColors.slate.label,
                backgroundColor: commonColors.slate.gridLine,
              },
              inputStyle: {
                color: commonColors.slate.label,
              },
            },
            buttonTheme: {
              style: {
                color: commonColors.slate.label,
                backgroundColor: commonColors.slate.gridLine,
              },
            },
            legend: {
              color: commonColors.slate.legend,
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
        commonColors.midnight.cardBorder, // Card Borders
        commonColors.midnight.layoutEdge, // Layout edges
        commonColors.midnight.cardColor, // Card colors
        commonColors.midnight.background, // Background of layout
        commonColors.midnight.background, // Background
        commonColors.midnight.background,
      ],
    },
    other: {
      titlebar: commonColors.midnight.titlebar,
      charts: {
        statsRing: {
          cpu: "white",
          memory: "white",
          swap: "white",
          disk: "white",
        },
        area: {
          default: {
            navigator: {
              handles: {
                backgroundColor: "white",
              },
              maskFill: "rgba(255, 255, 255, 0.2)",
            },
            gridLineColor: commonColors.midnight.gridLine,
            lineColor: commonColors.midnight.gridLine,
            labelColor: commonColors.midnight.label,
            tooltip: {
              color: commonColors.midnight.legend,
              backgroundColor: commonColors.midnight.tooltipBg,
            },
            scrollbar: {
              rifleColor: commonColors.midnight.scrollbar,
              barBackgroundColor: commonColors.midnight.scrollbar,
              buttonBackgroundColor: commonColors.midnight.scrollbar,
              trackBorderColor: commonColors.midnight.scrollbar,
            },
            rangeSelector: {
              labelStyle: {
                color: commonColors.midnight.label,
                backgroundColor: commonColors.midnight.gridLine,
              },
              inputStyle: {
                color: commonColors.midnight.label,
              },
            },
            buttonTheme: {
              style: {
                color: commonColors.midnight.label,
                backgroundColor: commonColors.midnight.gridLine,
              },
            },
            legend: {
              color: commonColors.midnight.legend,
            },
          },
          swap: {
            color: "white",
          },
          networkReceived: {
            color: "white",
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
        commonColors.bumblebee.cardBorder, // Card Borders
        commonColors.bumblebee.layoutEdge, // Layout edges
        commonColors.bumblebee.cardColor, // Card colors
        commonColors.bumblebee.background, // Background of layout
        commonColors.bumblebee.background, // Background
        commonColors.bumblebee.background,
      ],
    },
    other: {
      titlebar: commonColors.bumblebee.titlebar,
      charts: {
        statsRing: {
          cpu: commonColors.bumblebee.yellow,
          memory: commonColors.bumblebee.yellow,
          swap: commonColors.bumblebee.yellow,
          disk: commonColors.bumblebee.yellow,
        },
        area: {
          default: {
            navigator: {
              handles: {
                backgroundColor: "white",
              },
              maskFill: "rgba(255, 255, 255, 0.1)",
            },
            gridLineColor: commonColors.bumblebee.gridLine,
            lineColor: commonColors.bumblebee.gridLine,
            labelColor: commonColors.bumblebee.label,
            tooltip: {
              color: commonColors.bumblebee.legend,
              backgroundColor: commonColors.bumblebee.tooltipBg,
            },
            scrollbar: {
              rifleColor: commonColors.bumblebee.scrollbar,
              barBackgroundColor: commonColors.bumblebee.scrollbar,
              buttonBackgroundColor: commonColors.bumblebee.scrollbar,
              trackBorderColor: commonColors.bumblebee.scrollbar,
            },
            rangeSelector: {
              labelStyle: {
                color: commonColors.bumblebee.label,
                backgroundColor: commonColors.bumblebee.gridLine,
              },
              inputStyle: {
                color: commonColors.bumblebee.label,
              },
            },
            buttonTheme: {
              style: {
                color: commonColors.bumblebee.label,
                backgroundColor: commonColors.bumblebee.gridLine,
              },
            },
            legend: {
              color: commonColors.bumblebee.legend,
            },
          },
          swap: {
            color: commonColors.bumblebee.yellow,
          },
          networkReceived: {
            color: commonColors.bumblebee.yellow,
          },
          networksTransmitted: {
            color: commonColors.bumblebee.yellow,
          },
          memory: {
            color: commonColors.bumblebee.yellow,
          },
          globalCpu: {
            color: commonColors.bumblebee.yellow,
          },
        },
        bar: {
          cpus: {
            colors: [commonColors.bumblebee.yellow],
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
