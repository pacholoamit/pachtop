import { Geiger } from "react-geiger";

import AnalyticsProvider from "@/providers/analytics.provider";
import ThemeProvider from "@/providers/theme.provider";
import { Notifications } from "@mantine/notifications";

interface AppProvider {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProvider> = ({ children }) => {
  return (
    <Geiger renderTimeThreshold={50}>
      <AnalyticsProvider>
        <ThemeProvider>
          <Notifications />
          {children}
        </ThemeProvider>
      </AnalyticsProvider>
    </Geiger>
  );
};

export default AppProvider;
