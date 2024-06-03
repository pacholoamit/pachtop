import logoOnly from "/logo-only.png";
import React from "react";

import { Center, Code, Grid, Group, Header as MantineHeader, Image, Stack, TextInput, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { getVersion } from "@tauri-apps/api/app";

const Header = () => {
  const [version, setVersion] = React.useState<string>("");

  React.useEffect(() => {
    getVersion().then((v) => setVersion(v));
  }, []);
  return (
    <MantineHeader height={40}>
      <Group position="apart" align="end" pl={16} pr={16}>
        <div />
        <TextInput placeholder="Search..." size="xs" w={300} icon={<IconSearch size={14} />} />
        {version && <Code>v{version}</Code>}
      </Group>
    </MantineHeader>
  );
};

export default Header;
