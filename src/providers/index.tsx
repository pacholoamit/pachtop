import ThemeProvider from "@/providers/theme.provider";
import MetricsProvider from "@/features/metrics/contexts/metrics-context";
import NotificationsProvider from "@/providers/notifications.provider";
import ReduxProvider from "@/providers/redux.provider";

interface AppProvider {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProvider> = ({ children }) => {
  return (
    <ReduxProvider>
      <MetricsProvider>
        <ThemeProvider>
          <NotificationsProvider>{children}</NotificationsProvider>
        </ThemeProvider>
      </MetricsProvider>
    </ReduxProvider>
  );
};

export default AppProvider;
