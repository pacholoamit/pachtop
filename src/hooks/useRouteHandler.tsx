import React, { useEffect, useMemo, useState } from 'react';
import { matchRoutes, useLocation, useNavigate } from 'react-router-dom';

import DashboardPage from '@/features/metrics/pages/dashboard.page';
import DiskAnalyticsPage from '@/features/metrics/pages/disk-analytics.page';
import DisksPage from '@/features/metrics/pages/disks.page';
import ProcessesPage from '@/features/processes/pages/processes-revamp.page';
import SettingsPage from '@/features/settings/pages/settings.page';

type STATIC_ROUTE = "/" | "/disks" | "/processes" | "/settings";

type DYNAMIC_ROUTE = "/disks/:id";

type ROUTE = STATIC_ROUTE | DYNAMIC_ROUTE;

export const routes: { path: ROUTE; idx: number; element: JSX.Element }[] = [
  {
    path: "/",
    idx: 0,
    element: <DashboardPage />,
  },
  {
    path: "/disks",
    idx: 1,
    element: <DisksPage />,
  },
  {
    path: "/disks/:id",
    idx: 1,
    element: <DiskAnalyticsPage />,
  },
  {
    path: "/processes",
    idx: 2,
    element: <ProcessesPage />,
  },
  {
    path: "/settings",
    idx: 3,
    element: <SettingsPage />,
  },
];

const useRouteHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(0);
  const isLocationKeyDefault = useMemo(() => location.key === "default", [location.key]);

  useEffect(() => {
    const diskById = matchRoutes([{ path: "/disks/:id" }], location.pathname);
    if (diskById && diskById.length > 0) return setActive(1);

    const routeMap: Record<STATIC_ROUTE, number> = {
      "/": routes[0].idx,
      "/disks": routes[1].idx,
      "/processes": routes[2].idx,
      "/settings": routes[3].idx,
    };

    setActive(routeMap[location.pathname as STATIC_ROUTE] || 0);
  }, [location.pathname]);

  const navigateToStatic = (route: STATIC_ROUTE) => {
    if (location.pathname === route) return;
    navigate(route);
  };

  const navigateToDynamic = (route: DYNAMIC_ROUTE, id: string) => {
    if (location.pathname === route.replace(":id", id)) return;
    navigate(route.replace(":id", id));
  };

  const canGoBackward = useMemo(() => !isLocationKeyDefault, [isLocationKeyDefault]);

  const canGoForward = useMemo(
    () => window.history.state.idx < window.history.length - 1,
    [window.history.length, window.history.state.idx]
  );

  const goBack = () => navigate(-1);

  const goForward = () => navigate(1);

  return { active, setActive, navigateToStatic, navigateToDynamic, goForward, goBack, canGoBackward, canGoForward };
};

export default useRouteHandler;
