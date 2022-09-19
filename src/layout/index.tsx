import Navbar from "@/layout/components/navbar";
import { AppShell, Card, useMantineTheme } from "@mantine/core";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  const theme = useMantineTheme();
  const styles = {
    main: {
      background: theme.colors.dark[8],
    },
  };

  return (
    <AppShell
      styles={styles}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={<Navbar />}
    >
      <Card style={{ backgroundColor: theme.colors.dark[7] }} radius={"md"}>
        <Outlet />
      </Card>
    </AppShell>
  );
};

export default Layout;
