import { useContext } from "react";

import { PlatformContext } from "@/providers/platform.provider";

const usePlatform = () => useContext(PlatformContext);

export default usePlatform;
