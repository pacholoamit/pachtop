import { Geiger } from 'react-geiger';

import AnalyticsProvider from '@/providers/analytics.provider';
import ServerEventsProvider from '@/providers/server-events.provider';
import ThemeProvider from '@/providers/theme.provider';
import { Notifications } from '@mantine/notifications';

interface AppProvider {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProvider> = ({ children }) => {
  return (
    <Geiger renderTimeThreshold={50}>
      <AnalyticsProvider>
        <ThemeProvider>
          <ServerEventsProvider>
            <Notifications />
            {children}
          </ServerEventsProvider>
        </ThemeProvider>
      </AnalyticsProvider>
    </Geiger>
  );
};

export default AppProvider;
