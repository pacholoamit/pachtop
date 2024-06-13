import usePlatform from "@/hooks/usePlatform";
import useRouteHandler from "@/hooks/useRouteHandler";
import { ActionIcon, Group } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

const NavigationHistory = () => {
  const { appHeader } = usePlatform();

  const { canGoBackward, canGoForward, goBack, goForward } = useRouteHandler();

  return (
    <Group spacing={"xs"} style={{ paddingLeft: appHeader.paddingLeft, paddingTop: appHeader.paddingTop }}>
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
