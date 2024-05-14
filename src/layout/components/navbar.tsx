import NavbarOptions from "@/layout/components/navbar-options";
import NavbarFooter from "@/layout/components/navbar-footer";
import NavbarLogo from "@/layout/components/navbar-logo";
import { Navbar as MantineNavbar, Navbar, ScrollArea, Space } from "@mantine/core";

const AppNavbar = () => {
  return (
    <MantineNavbar p="sm" width={{ md: 230, base: 73 }}>
      <Navbar.Section ml={"auto"} mr={"auto"}>
        <NavbarLogo />
      </Navbar.Section>
      <Space h={"md"} />
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <NavbarOptions />
      </Navbar.Section>
      <Navbar.Section>
        <NavbarFooter />
      </Navbar.Section>
    </MantineNavbar>
  );
};

export default AppNavbar;
