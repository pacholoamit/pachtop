import UserProvider from "@/providers/user.provider";
import ThemeProvider from "@/providers/theme.provider";
import ServerEventsProvider from "@/providers/server-events.provider";
import { Notifications } from "@mantine/notifications";

interface AppProvider {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProvider> = ({ children }) => {
  return (
    <ThemeProvider>
      <ServerEventsProvider>
        <UserProvider>
          <Notifications />
          {children}
        </UserProvider>
      </ServerEventsProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
