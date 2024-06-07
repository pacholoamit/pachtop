import { useEffect, useState } from "react";
import { matchRoutes, useLocation, useNavigate } from "react-router-dom";

import { ActionIcon, Group, MantineTheme, Portal, Tooltip, UnstyledButton } from "@mantine/core";
import { IconCpu, IconLayoutDashboard, IconServer, IconSettings } from "@tabler/icons-react";

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

// TODO: create zustand store for active navbar option
const NavbarOptions = () => {
  const [active, setActive] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    // Jeezus this is such a hack
    const diskById = matchRoutes([{ path: "/disks/:id" }], location.pathname);
    if (diskById && diskById.length > 0) return setActive(1);

    const routeMap: Record<string, number> = {
      "/": 0,
      "/disks": 1,
      "/processes": 2,
      "/settings": 3,
    };

    setActive(routeMap[location.pathname] || 0);
  }, [location.pathname]);

  const options: NavbarOptionProps[] = [
    {
      icon: <IconLayoutDashboard size={24} />,
      label: "Dashboard",
      onClick: () => {
        if (location.pathname === "/") return;
        navigate("/");
      },
    },
    {
      icon: <IconServer size={24} />,
      label: "Disks",
      onClick: () => {
        if (location.pathname === "/disks") return;
        navigate("/disks");
      },
    },
    {
      icon: <IconCpu size={24} />,
      label: "Processes",
      onClick: () => {
        if (location.pathname === "/processes") return;
        navigate("/processes");
      },
    },
    {
      icon: <IconSettings size={24} />,
      label: "Settings",
      onClick: () => {
        if (location.pathname === "/settings") return;
        navigate("/settings");
      },
    },
  ];

  const navbarOptions = options.map((option, index) => (
    <NavbarOption
      {...option}
      key={option.label}
      active={index === active}
      onClick={() => {
        setActive(index);
        option.onClick?.();
      }}
    />
  ));
  return <>{navbarOptions}</>;
};

export default NavbarOptions;
