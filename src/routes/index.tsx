import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/home.page";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
