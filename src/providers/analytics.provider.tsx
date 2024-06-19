import posthog, { PostHogConfig } from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

import useSystemStoreSelectors from "@/features/metrics/stores/system.store";
import useEffectAsync from "@/hooks/useEffectAsync";
import logger from "@/lib/logger";
import { getVersion } from "@tauri-apps/api/app";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

const options: Partial<PostHogConfig> = {
  api_host: "https://us.i.posthog.com",
};

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const os = useSystemStoreSelectors(useShallow((state) => state.info.os));

  useEffectAsync(async () => {
    const userId = posthog.get_distinct_id();

    posthog.identify(userId, {
      version: await getVersion(),
      app_os: os,
    });
  }, []);

  return (
    <PostHogProvider apiKey={"phc_vSut74z2u93fsNspbRNT0XoKaAlVDs54RV8bPlxdo96"} options={options}>
      {children}
    </PostHogProvider>
  );
};

export default AnalyticsProvider;
