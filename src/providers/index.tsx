import ThemeProvider from "@/providers/theme.provider";
import MetricsProvider from "@/features/metrics/contexts/metrics-context";

interface AppProvider {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProvider> = ({ children }) => {
  return (
    <MetricsProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </MetricsProvider>
  );
};

export default AppProvider;
