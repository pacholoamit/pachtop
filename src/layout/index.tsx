import { Outlet } from "react-router-dom";

import Navbar from "@/layout/components/navbar";
import { AppShell, Box, Button, Styles, Tooltip, useMantineTheme } from "@mantine/core";

import AppFooter from "./components/footer";
import Header from "./components/header";

const Layout: React.FC = () => {
  const theme = useMantineTheme();
  const styles: Styles<"body" | "main" | "root", never> | undefined = {
    main: {
      background: theme.colors.dark[8],
    },
  };

  return (
    <AppShell styles={styles} navbar={<Navbar />} footer={<AppFooter />} header={<Header />} padding={"xl"}>
      <Outlet />
    </AppShell>
  );
};

export default Layout;
