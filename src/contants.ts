import { MantineThemeOverride } from "@mantine/core";

export const VIEWABLE_ELEMENT_COUNT = 60 * 30; // Viewable elements in the chart (60 seconds * 30 )

export const DEFAULT_TITLEBAR_COLOR = "#09090b";

// themeConstants.ts

export enum THEME_OPTION {
  SLATE = "slate",
  MIDNIGHT = "midnight",
}

export const commonColors = {
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
    cardColor: "transparent",
    background: "#09090b",
    gridLine: "#27272a",
    label: "white",
    scrollbar: "#27272a",
    tooltipBg: "#09090b",
    titlebar: "#09090b",
    legend: "#dce1e8",
  },
};

const areaChartThemeOptions = {
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
        [0, "rgb(0, 236, 254, 0.75)"],
        [1, "rgba(0, 236, 254, 0.35)"],
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
        "#152847",
        "#324363",
        "#324363",
        "#152847",
        "#0d1830",
        "#0d1830",
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
          ...areaChartThemeOptions,
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
        commonColors.midnight.cardBorder,
        commonColors.midnight.layoutEdge,
        commonColors.midnight.cardColor,
        commonColors.midnight.background,
        commonColors.midnight.background,
        commonColors.midnight.background,
      ],
    },
    other: {
      titlebar: commonColors.midnight.titlebar,
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
          ...areaChartThemeOptions,
        },
        bar: {
          cpus: {
            colors: ["#7B2EDA"],
          },
        },
      },
    },
  },
};
