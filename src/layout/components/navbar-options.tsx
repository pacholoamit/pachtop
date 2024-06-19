import useRouteHandler from '@/hooks/useRouteHandler';
import { MantineTheme, Tooltip, UnstyledButton } from '@mantine/core';
import { IconCpu, IconLayoutDashboard, IconServer, IconSettings } from '@tabler/icons-react';

interface NavbarOptionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export const NavbarOption: React.FC<NavbarOptionProps> = (props) => {
  const { icon, label, onClick, active } = props;

  const sx = (theme: MantineTheme) => ({
    display: "block",
    width: "100%",
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colors.dark[0],
    "&:hover": {
      backgroundColor: theme.colors.dark[3],
    },
    "&[data-active]": {
      backgroundColor: theme.colors.dark[3],
    },
  });

  return (
    <Tooltip label={label} position="right" withArrow color={"gray"}>
      <UnstyledButton sx={sx} onClick={onClick} data-active={active || undefined}>
        {icon}
      </UnstyledButton>
    </Tooltip>
  );
};

// TODO: Fix navigation handling

const NavbarOptions = () => {
  const { active, setActive, navigateToStatic } = useRouteHandler();

  // Must match by index for useRouteHandler hook
  const options: NavbarOptionProps[] = [
    {
      icon: <IconLayoutDashboard size={24} />,
      label: "Dashboard",
      onClick: () => navigateToStatic("/"),
    },
    {
      icon: <IconServer size={24} />,
      label: "Disks",
      onClick: () => navigateToStatic("/disks"),
    },
    {
      icon: <IconCpu size={24} />,
      label: "Processes",
      onClick: () => navigateToStatic("/processes"),
    },
    {
      icon: <IconSettings size={24} />,
      label: "Settings",
      onClick: () => navigateToStatic("/settings"),
    },
  ];

  const navbarOptions = options.map((option, index) => (
    <NavbarOption
      {...option}
      key={option.label}
      active={active === index}
      onClick={() => {
        setActive(index);
        option.onClick?.();
      }}
    />
  ));
  return <>{navbarOptions}</>;
};

export default NavbarOptions;
