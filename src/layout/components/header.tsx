import logoOnly from "/logo-only.png";
import React from "react";

import {
  Badge,
  Center,
  Code,
  Grid,
  Group,
  Header as MantineHeader,
  Image,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { getVersion } from "@tauri-apps/api/app";

const Header = () => {
  const [version, setVersion] = React.useState<string>("");

  React.useEffect(() => {
    getVersion().then((v) => setVersion(v));
  }, []);
  return (
    <MantineHeader height={48} style={{ backgroundColor: "transparent", backdropFilter: "blur(15px)" }}>
      <Group position="apart" align="center" pl={8} pr={8} pt={8}>
        <Badge color="teal" variant="dot">
          Pachtop {version && `v${version}`}
        </Badge>
        <TextInput placeholder="Search..." size="xs" w={300} icon={<IconSearch size={14} />} disabled />
        <div />
      </Group>
    </MantineHeader>
  );
};

export default Header;
