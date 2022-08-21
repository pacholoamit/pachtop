import { MantineProvider, MantineThemeOverride } from "@mantine/core";

interface IThemeProvider {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<IThemeProvider> = ({ children }) => {
  const theme: MantineThemeOverride = {
    fontFamily: "Roboto",
    colorScheme: "dark",
  };
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      {children}
    </MantineProvider>
  );
};

export default ThemeProvider;
