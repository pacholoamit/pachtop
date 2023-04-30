import ThemeProvider from "@/providers/theme.provider";
import NotificationsProvider from "@/providers/notifications.provider";
import ServerEventsProvider from "@/providers/server-events.context";

interface AppProvider {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProvider> = ({ children }) => {
  return (
    <ServerEventsProvider>
      <ThemeProvider>
        <NotificationsProvider>{children}</NotificationsProvider>
      </ThemeProvider>
    </ServerEventsProvider>
  );
};

export default AppProvider;
