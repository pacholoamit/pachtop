import ThemeProvider from "@/providers/theme.provider";
import MetricsProvider from "@/features/metrics/contexts/metrics-context";
import NotificationsProvider from "@/providers/notifications.provider";
import ServerEventsProvider from "@/providers/server-events.context";

interface AppProvider {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProvider> = ({ children }) => {
  return (
    <ServerEventsProvider>
      <MetricsProvider>
        <ThemeProvider>
          <NotificationsProvider>{children}</NotificationsProvider>
        </ThemeProvider>
      </MetricsProvider>
    </ServerEventsProvider>
  );
};

export default AppProvider;
