import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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
