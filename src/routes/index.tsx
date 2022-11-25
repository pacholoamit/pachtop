import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/layout";
import DashboardPage from "@/features/metrics/pages/dashboard.page";
import DisksPage from "@/features/metrics/pages/disks.page";
import ProcessesPage from "@/features/metrics/pages/processes.page";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/disks" element={<DisksPage />} />
          <Route path="/processes" element={<ProcessesPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
