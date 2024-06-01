import { memo } from "react";

import { Group, Stack, Title } from "@mantine/core";

interface PageWrapperProps {
  name: string;
  children: React.ReactNode;
  widget?: React.ReactNode;
  height?: number | string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, name, height, widget }) => {
  return (
    <Stack spacing="md" h={height}>
      <Group position="apart">
        <Title order={1}>{name}</Title>
        {widget}
      </Group>
      {children}
    </Stack>
  );
};

export default memo(PageWrapper);
