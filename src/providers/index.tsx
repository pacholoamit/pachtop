import ThemeProvider from "@/providers/theme.provider";
import MetricsProvider from "@/features/metrics/contexts/metrics-context";
import NotificationsProvider from "@/providers/notifications.provider";

interface AppProvider {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProvider> = ({ children }) => {
  return (
    <MetricsProvider>
      <ThemeProvider>
        <NotificationsProvider>{children}</NotificationsProvider>
      </ThemeProvider>
    </MetricsProvider>
  );
};

export default AppProvider;
