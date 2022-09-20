import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "@/pages/dashboard.page";
import Layout from "@/layout";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
