import { createContext, useEffect, useState } from "react";

import ExclusionModal from "@/components/exclusion-modal";
import useEffectAsync from "@/hooks/useEffectAsync";
import useIsFirstRun from "@/hooks/useIsFirstRun";
import { streams } from "@/lib";
import store from "@/lib/store";
import { getCurrent as appWindow } from "@tauri-apps/api/window";
import { Platform, platform as obtainPlatform } from "@tauri-apps/plugin-os";

interface PlatformProviderProps {
  children: React.ReactNode;
}

interface AppHeader {
  paddingLeft: string | number;
  paddingTop: string | number;
  onHeaderAreaClick: () => void;
}
interface PlatformContextType {
  appHeader: AppHeader;
}

export const PlatformContext = createContext<PlatformContextType>({
  appHeader: {
    paddingLeft: 0,
    paddingTop: 0,
    onHeaderAreaClick() {},
  },
});

/**
 *
 * Mainly used for platform specific stuff
 *
 */
const PlatformProvider: React.FC<PlatformProviderProps> = ({ children }) => {
  const isFirstRun = useIsFirstRun();
  const [platform, setPlatform] = useState<Platform>("windows");
  const [appHeader, setAppHeader] = useState<AppHeader>({
    paddingLeft: 0,
    paddingTop: 0,
    onHeaderAreaClick: () => {},
  });

  const [isShowExclusionModal, setIsShowExclusionModal] = useState(false);

  useEffectAsync(async () => {
    await obtainPlatform().then((p) => {
      setPlatform(p);

      if (p === "windows") {
        store.isDefenderExclusionEnabled.get().then((isDefenderExclusionEnabled) => {
          if (!isDefenderExclusionEnabled) setIsShowExclusionModal(true);
        });
      }

      if (p === "macos") {
        setAppHeader({
          paddingLeft: 72,
          paddingTop: 4,
          onHeaderAreaClick: () => {
            const window = appWindow();
            window.startDragging();
          },
        });

        streams.window.willEnterFullScreen(() => {
          setAppHeader((prev) => ({
            ...prev,
            paddingLeft: 0,
            paddingTop: 0,
          }));
        });

        streams.window.willExitFullScreen(() => {
          setAppHeader((prev) => ({
            ...prev,
            paddingLeft: 72,
            paddingTop: 4,
          }));
        });
      }
    });
  }, []);

  return (
    <PlatformContext.Provider
      value={{
        appHeader,
      }}
    >
      {isShowExclusionModal && <ExclusionModal />}
      {children}
    </PlatformContext.Provider>
  );
};

export default PlatformProvider;
