import React from "react";

import { Badge, Group, Header as MantineHeader } from "@mantine/core";
import { getVersion } from "@tauri-apps/api/app";

import NavigationHistory from "./navigation-history";

const Header = () => {
  const [version, setVersion] = React.useState<string>("");

  React.useEffect(() => {
    getVersion().then((v) => setVersion(v));
  }, []);
  return (
    <MantineHeader height={48} style={{ backgroundColor: "transparent", backdropFilter: "blur(15px)" }}>
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
