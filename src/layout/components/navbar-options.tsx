import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useMediaQuery from "@/hooks/useMediaQuery";
import { ActionIcon, Group, MantineTheme, MediaQuery, Text, ThemeIcon, Tooltip, UnstyledButton } from "@mantine/core";
import { IconArticle, IconCpu, IconLayoutDashboard, IconServer, IconSettings } from "@tabler/icons-react";

interface NavbarOptionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

const NavbarOption: React.FC<NavbarOptionProps> = (props) => {
  const { icon, label, onClick, active } = props;
  const { isSmallerThanMd } = useMediaQuery();
  const position = isSmallerThanMd ? "center" : "left";

  const sx = (theme: MantineTheme) => ({
    display: "block",
    width: "100%",
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colors.dark[0],
    "&:hover": {
      backgroundColor: theme.colors.dark[6],
    },
    "&[data-active]": {
      backgroundColor: theme.colors.dark[6],
    },
  });

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton sx={sx} onClick={onClick} data-active={active || undefined}>
        <Group position={position}>
          <ActionIcon variant="transparent" size={"md"}>
            {icon}
          </ActionIcon>
        </Group>
      </UnstyledButton>
    </Tooltip>
  );
};

const NavbarOptions = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const options: NavbarOptionProps[] = [
    {
      icon: <IconLayoutDashboard size={16} />,
      label: "Dashboard",
      onClick: () => navigate("/"),
    },
    {
      icon: <IconServer size={16} />,
      label: "Disks",
      onClick: () => navigate("/disks"),
    },
    {
      icon: <IconCpu size={16} />,
      label: "Processes",
      onClick: () => {
        navigate("/processes");
      },
    },
    {
      icon: <IconSettings size={16} />,
      label: "Settings",
      onClick: () => {
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
