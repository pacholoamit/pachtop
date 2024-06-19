import { Geiger } from "react-geiger";

import AnalyticsProvider from "@/providers/analytics.provider";
import PlatformProvider from "@/providers/platform.provider";
import SettingsProvider from "@/providers/settings.provider";
import ThemeProvider from "@/providers/theme.provider";
import { Notifications } from "@mantine/notifications";

interface AppProvider {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProvider> = ({ children }) => {
  return (
    <Geiger renderTimeThreshold={50}>
      <SettingsProvider>
        <AnalyticsProvider>
          <ThemeProvider>
            <PlatformProvider>
              <Notifications />
              {children}
            </PlatformProvider>
          </ThemeProvider>
        </AnalyticsProvider>
      </SettingsProvider>
    </Geiger>
  );
};

export default AppProvider;
