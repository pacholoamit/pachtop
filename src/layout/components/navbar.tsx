import NavbarOptions from "@/layout/components/navbar-options";
import { Navbar as MantineNavbar, ScrollArea, Space } from "@mantine/core";

const AppNavbar = () => {
  return (
    <MantineNavbar p={0} width={{ base: 50 }}>
      <MantineNavbar.Section mx="-xs" px="xs">
        <NavbarOptions />
      </MantineNavbar.Section>
    </MantineNavbar>
  );
};

export default AppNavbar;
