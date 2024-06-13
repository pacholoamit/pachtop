import { Geiger } from "react-geiger";

import AnalyticsProvider from "@/providers/analytics.provider";
import ThemeProvider from "@/providers/theme.provider";
import { Notifications } from "@mantine/notifications";
import PlatformProvider from "@/providers/platform.provider";

interface AppProvider {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProvider> = ({ children }) => {
  return (
    <Geiger renderTimeThreshold={50}>
      <AnalyticsProvider>
        <ThemeProvider>
          <PlatformProvider>
            <Notifications />
            {children}
          </PlatformProvider>
        </ThemeProvider>
      </AnalyticsProvider>
    </Geiger>
  );
};

export default AppProvider;
