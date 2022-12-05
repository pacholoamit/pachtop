import useMediaQuery from "@/hooks/useMediaQuery";
import {
  IconLayoutDashboard,
  IconServer,
  IconArticle,
  IconCpu,
} from "@tabler/icons";
import {
  UnstyledButton,
  Group,
  ThemeIcon,
  Text,
  MediaQuery,
  MantineTheme,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

interface NavbarOptionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavbarOption: React.FC<NavbarOptionProps> = (props) => {
  const { icon, label, onClick } = props;
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
  });

  return (
    <UnstyledButton sx={sx} onClick={onClick}>
      <Group position={position}>
        <ThemeIcon variant="gradient">{icon}</ThemeIcon>
        <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
          <Text>{label}</Text>
        </MediaQuery>
      </Group>
    </UnstyledButton>
  );
};

const NavbarOptions = () => {
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
      icon: <IconArticle size={16} />,
      label: "Logs",
      onClick: () => {},
    },
  ];

  const navbarOptions = options.map((option) => (
    <NavbarOption {...option} key={option.label} />
  ));
  return <>{navbarOptions}</>;
};

export default NavbarOptions;
