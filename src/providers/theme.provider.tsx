import { MantineProvider, MantineThemeOverride } from "@mantine/core";

interface IThemeProvider {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<IThemeProvider> = ({ children }) => {
  const theme: MantineThemeOverride = {
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
  };
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      {children}
    </MantineProvider>
  );
};

export default ThemeProvider;
