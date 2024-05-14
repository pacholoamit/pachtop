import { PostHogProvider } from "posthog-js/react";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

const options = {
  api_host: process.env.VITE_PUBLIC_POSTHOG_HOST,
};

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  return (
    <PostHogProvider apiKey={process.env.VITE_PUBLIC_POSTHOG_KEY} options={options}>
      {children}
    </PostHogProvider>
  );
};

export default AnalyticsProvider;
