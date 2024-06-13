import React from "react";

import { Badge, Group, Header as MantineHeader } from "@mantine/core";
import { getVersion } from "@tauri-apps/api/app";

import NavigationHistory from "./navigation-history";
import usePlatform from "@/hooks/usePlatform";

const Header = () => {
  const { appHeader } = usePlatform();
  const [version, setVersion] = React.useState<string>("");

  const onClick = () => appHeader.onHeaderAreaClick();

  React.useEffect(() => {
    getVersion().then((v) => setVersion(v));
  }, []);
  return (
    <MantineHeader
      height={48}
      style={{ backgroundColor: "transparent", backdropFilter: "blur(15px)" }}
      onMouseDown={onClick}
    >
      <Group position="apart" align="center" pl={8} pr={8} pt={8}>
        <NavigationHistory />
        <Badge color="teal" variant="dot">
          Pachtop {version && `v${version}`}
        </Badge>

        <div />
      </Group>
    </MantineHeader>
  );
};

export default Header;
