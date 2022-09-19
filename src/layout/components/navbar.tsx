import logo from "/logo-white.png";
import { useState } from "react";
import {
  IconGitPullRequest,
  IconAlertCircle,
  IconMessages,
  IconDatabase,
} from "@tabler/icons";
import {
  Group,
  Image,
  Navbar as MantineNavbar,
  Navbar,
  ScrollArea,
  ThemeIcon,
  UnstyledButton,
  Text,
} from "@mantine/core";

interface NavbarOptionProps {
  icon: React.ReactNode;
  color: string;
  label: string;
}

const NavbarOption: React.FC<NavbarOptionProps> = ({ icon, color, label }) => {
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colors.dark[0],
        "&:hover": {
          backgroundColor: theme.colors.dark[6],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
};

const NavbarOptions = () => {
  const options = [
    {
      icon: <IconGitPullRequest size={16} />,
      color: "blue",
      label: "Pull Requests",
    },
    {
      icon: <IconAlertCircle size={16} />,
      color: "teal",
      label: "Open Issues",
    },
    { icon: <IconMessages size={16} />, color: "violet", label: "Discussions" },
    { icon: <IconDatabase size={16} />, color: "grape", label: "Databases" },
  ];

  const navbarOptions = options.map((option) => (
    <NavbarOption {...option} key={option.label} />
  ));
  return <>{navbarOptions}</>;
};

const AppNavbar = () => {
  const [opened, setOpened] = useState(false);
  return (
    <MantineNavbar
      p="sm"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 80, lg: 230 }}
    >
      <Navbar.Section ml={"auto"} mr={"auto"}>
        <Image src={logo} alt="Logo" withPlaceholder />
      </Navbar.Section>
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <NavbarOptions />
      </Navbar.Section>
    </MantineNavbar>
  );
};

export default AppNavbar;
