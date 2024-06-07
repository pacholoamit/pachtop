import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ActionIcon, Button, Group } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

const NavigationHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLocationKeyDefault = useMemo(() => location.key === "default", [location.key]);

  const canGoBackward = useMemo(() => !isLocationKeyDefault, [isLocationKeyDefault]);

  const canGoForward = useMemo(
    () => window.history.state.idx < window.history.length - 1,
    [window.history.length, window.history.state.idx]
  );

  const goBack = () => navigate(-1);

  const goForward = () => navigate(1);

  return (
    <Group spacing={"xs"}>
      <ActionIcon onClick={goBack} disabled={!canGoBackward} variant={"transparent"}>
        <IconArrowLeft />
      </ActionIcon>
      <ActionIcon variant={"transparent"} disabled={!canGoForward}>
        <IconArrowRight onClick={goForward} />
      </ActionIcon>
    </Group>
  );
};

export default NavigationHistory;
