import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/home.page";
import Layout from "@/layout";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
