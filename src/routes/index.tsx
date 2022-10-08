import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "@/features/metrics/pages/dashboard.page";
import DisksPage from "@/features/metrics/pages/disks.page";
import Layout from "@/layout";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/disks" element={<DisksPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
