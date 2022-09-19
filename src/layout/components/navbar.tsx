import { useState } from "react";
import { Navbar as MantineNavbar, Text } from "@mantine/core";

const AppNavbar = () => {
  const [opened, setOpened] = useState(false);
  return (
    <MantineNavbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 80, lg: 230 }}
    >
      <Text>Application navbar</Text>
    </MantineNavbar>
  );
};

export default AppNavbar;
