import logoOnly from "/logo-only.png";

import { Center, Grid, Group, Header as MantineHeader, Image, Stack, TextInput, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

const Header = () => {
  return (
    <MantineHeader height={40}>
      <Group position="apart" align="center">
        <div />
        <TextInput placeholder="Search..." size="xs" w={300} icon={<IconSearch size={14} />} />
        <div />
      </Group>
    </MantineHeader>
  );
};

export default Header;
