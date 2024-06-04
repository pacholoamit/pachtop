import { Outlet } from "react-router-dom";

import Ellipsis from "@/components/ellipsis";
import useTheme from "@/hooks/useTheme";
import Navbar from "@/layout/components/navbar";
import { AppShell, Styles, useMantineTheme } from "@mantine/core";

import AppFooter from "./components/footer";
import Header from "./components/header";

const Layout: React.FC = () => {
  const theme = useMantineTheme();
  const { isMidnight } = useTheme();

  const styles: Styles<"body" | "main" | "root", never> | undefined = {
    main: {
      background: theme.colors.dark[8],
    },
  };

  return (
    <AppShell styles={styles} navbar={<Navbar />} footer={<AppFooter />} header={<Header />} padding={"xl"}>
      {isMidnight && <Ellipsis right="0px" width="75%" blur="150px" top="100" />}
      <Outlet />
    </AppShell>
  );
};

export default Layout;
