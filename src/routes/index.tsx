import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "@/features/metrics/pages/dashboard.page";
import StoragePage from "@/features/storage/pages/storage.page";
import Layout from "@/layout";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/storage" element={<StoragePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
