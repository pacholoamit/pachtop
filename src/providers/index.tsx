import ThemeProvider from "@/providers/theme.provider";
import ServerEventsProvider from "@/providers/server-events.context";
import { Notifications } from "@mantine/notifications";

interface AppProvider {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProvider> = ({ children }) => {
  return (
    <ServerEventsProvider>
      <ThemeProvider>
        <Notifications />
        {children}
      </ThemeProvider>
    </ServerEventsProvider>
  );
};

export default AppProvider;
