import { useState } from "react";
import { Image, Navbar as MantineNavbar, Navbar } from "@mantine/core";
import logo from "/logo-white.png";

const AppNavbar = () => {
  const [opened, setOpened] = useState(false);
  return (
    <MantineNavbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 80, lg: 230 }}
    >
      <Navbar.Section style={{ marginLeft: "auto", marginRight: "auto" }}>
        <Image src={logo} alt="Logo" />
      </Navbar.Section>
    </MantineNavbar>
  );
};

export default AppNavbar;
