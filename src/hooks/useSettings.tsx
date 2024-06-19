import { useContext } from "react";

import { SettingsContext } from "@/providers/settings.provider";

const useSettings = () => useContext(SettingsContext);

export default useSettings;
