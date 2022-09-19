import Navbar from "@/layout/components/navbar";
import { AppShell, useMantineTheme } from "@mantine/core";
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
      <Outlet />
    </AppShell>
  );
};

export default Layout;
