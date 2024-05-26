import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import DashboardPage from "@/features/metrics/pages/dashboard.page";
import DiskAnalyticsPage from "@/features/metrics/pages/disk-analytics.page";
import DisksPage from "@/features/metrics/pages/disks.page";
import ProcessesPage from "@/features/processes/pages/processes-revamp.page";
import SettingsPage from "@/features/settings/pages/settings.page";
import Layout from "@/layout";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/disks" element={<DisksPage />} />
          <Route path="/disks/:id" element={<DiskAnalyticsPage />} />
          <Route path="/processes" element={<ProcessesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
