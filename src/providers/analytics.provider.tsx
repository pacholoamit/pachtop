import { PostHogProvider } from 'posthog-js/react';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

// TODO: Make these env vars
const options = {
  api_host: "https://us.i.posthog.com",
};

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  return (
    <PostHogProvider apiKey={"phc_vSut74z2u93fsNspbRNT0XoKaAlVDs54RV8bPlxdo96"} options={options}>
      {children}
    </PostHogProvider>
  );
};

export default AnalyticsProvider;
