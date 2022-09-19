import Navbar from "@/layout/components/navbar";
import Header from "@/layout/components/header";
import {
  AppShell,
  Card,
  useMantineTheme,
  Text,
  Box,
  Styles,
} from "@mantine/core";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  const theme = useMantineTheme();
  const styles: Styles<"body" | "main" | "root", never> | undefined = {
    main: {
      background: theme.colors.dark[8],
    },
  };

  return (
    <AppShell
      styles={styles}
      navbarOffsetBreakpoint="sm"
      navbar={<Navbar />}
      padding={"xl"}
    >
      {/* <Header /> */}
      <Card style={{ backgroundColor: theme.colors.dark[7] }} radius={"md"}>
        <Outlet />
      </Card>
    </AppShell>
  );
};

export default Layout;
