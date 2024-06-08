import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useRouteHandler from '@/hooks/useRouteHandler';
import { ActionIcon, Button, Group } from '@mantine/core';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

const NavigationHistory = () => {
  const { canGoBackward, canGoForward, goBack, goForward } = useRouteHandler();

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
