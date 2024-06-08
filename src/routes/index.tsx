import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import DashboardPage from "@/features/metrics/pages/dashboard.page";
import DiskAnalyticsPage from "@/features/metrics/pages/disk-analytics.page";
import DisksPage from "@/features/metrics/pages/disks.page";
import ProcessesPage from "@/features/processes/pages/processes-revamp.page";
import SettingsPage from "@/features/settings/pages/settings.page";
import { routes } from "@/hooks/useRouteHandler";
import Layout from "@/layout";

const AppRoutes: React.FC = () => {
  const appRoutes = routes.map(({ path, element }) => <Route key={path} path={path} element={element} />);
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>{appRoutes}</Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
