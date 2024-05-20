import NavbarFooter from "@/layout/components/navbar-footer";
import NavbarLogo from "@/layout/components/navbar-logo";
import NavbarOptions from "@/layout/components/navbar-options";
import { Navbar as MantineNavbar, ScrollArea, Space } from "@mantine/core";

const AppNavbar = () => {
  return (
    <MantineNavbar p="sm" width={{ md: 230, base: 73 }}>
      <MantineNavbar.Section ml={"auto"} mr={"auto"}>
        <NavbarLogo />
      </MantineNavbar.Section>
      <Space h={"md"} />
      <MantineNavbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <NavbarOptions />
      </MantineNavbar.Section>
      <MantineNavbar.Section>
        <NavbarFooter />
      </MantineNavbar.Section>
    </MantineNavbar>
  );
};

export default AppNavbar;
