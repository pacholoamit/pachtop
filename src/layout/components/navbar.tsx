import logo from "/logo-white.png";
import NavbarOptions from "@/layout/components/navbar-options";
import {
  Image,
  Navbar as MantineNavbar,
  Navbar,
  ScrollArea,
  Space,
} from "@mantine/core";

const AppNavbar = () => {
  return (
    <MantineNavbar p="sm" width={{ md: 230, base: 73 }}>
      <Navbar.Section ml={"auto"} mr={"auto"}>
        <Image src={logo} alt="Logo" withPlaceholder />
      </Navbar.Section>
      <Space h={"md"} />
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <NavbarOptions />
      </Navbar.Section>
    </MantineNavbar>
  );
};

export default AppNavbar;
