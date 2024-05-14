import UserProvider from "@/providers/user.provider";
import ThemeProvider from "@/providers/theme.provider";
import ServerEventsProvider from "@/providers/server-events.provider";
import AnalyticsProvider from "@/providers/analytics.provider";
import { Notifications } from "@mantine/notifications";
import { Geiger } from "react-geiger";

interface AppProvider {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProvider> = ({ children }) => {
  return (
    <Geiger renderTimeThreshold={50}>
      <AnalyticsProvider>
        <ThemeProvider>
          <ServerEventsProvider>
            <UserProvider>
              <Notifications />
              {children}
            </UserProvider>
          </ServerEventsProvider>
        </ThemeProvider>
      </AnalyticsProvider>
    </Geiger>
  );
};

export default AppProvider;
