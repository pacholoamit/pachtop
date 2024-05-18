import { Stack, Title } from "@mantine/core";

interface PageWrapperProps {
  name: string;
  children: React.ReactNode;
  height?: number | string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, name, height }) => {
  return (
    <Stack spacing="md" h={height}>
      <Title order={1}>{name}</Title>
      {children}
    </Stack>
  );
};

export default PageWrapper;
