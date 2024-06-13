import { createContext, useEffect, useState } from "react";
import { Platform, platform as obtainPlatform } from "@tauri-apps/plugin-os";
import { getCurrent as appWindow } from "@tauri-apps/api/window";
import useEffectAsync from "@/hooks/useEffectAsync";

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

const PlatformProvider: React.FC<PlatformProviderProps> = ({ children }) => {
  const [platform, setPlatform] = useState<Platform>("macos");
  const [appHeader, setAppHeader] = useState<AppHeader>({
    paddingLeft: 0,
    paddingTop: 0,
    onHeaderAreaClick: () => {},
  });

  const onHeaderAreaClick = () => {
    if (platform === "macos") {
      const window = appWindow();
      console.log("dragging");
      window.startDragging();
    }
  };

  useEffectAsync(async () => {
    await obtainPlatform().then((p) => setPlatform(p));

    setAppHeader((prev) => ({
      ...prev,
      onHeaderAreaClick,
    }));
  }, []);

  return (
    <PlatformContext.Provider
      value={{
        appHeader,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export default PlatformProvider;
