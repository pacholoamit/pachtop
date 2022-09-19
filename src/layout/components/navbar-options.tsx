import { UnstyledButton, Group, ThemeIcon, Text } from "@mantine/core";
import {
  IconAlertCircle,
  IconDatabase,
  IconLayoutDashboard,
  IconMessages,
} from "@tabler/icons";

interface NavbarOptionProps {
  icon: React.ReactNode;
  label: string;
}

const NavbarOption: React.FC<NavbarOptionProps> = ({ icon, label }) => {
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
        <ThemeIcon variant="gradient">{icon}</ThemeIcon>
        <Text>{label}</Text>
      </Group>
    </UnstyledButton>
  );
};

const NavbarOptions = () => {
  const options = [
    {
      icon: <IconLayoutDashboard size={16} />,
      label: "Dashboard",
    },
    {
      icon: <IconAlertCircle size={16} />,
      label: "Metrics",
    },
    { icon: <IconMessages size={16} />, label: "DNS" },
    { icon: <IconDatabase size={16} />, label: "Storage" },
  ];

  const navbarOptions = options.map((option) => (
    <NavbarOption {...option} key={option.label} />
  ));
  return <>{navbarOptions}</>;
};

export default NavbarOptions;
