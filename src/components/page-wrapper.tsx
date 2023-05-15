import { Stack, Title } from "@mantine/core";

interface PageWrapperProps {
  name: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, name }) => {
  return (
    <Stack spacing="lg">
      <Title order={2}>{name}</Title>
      {children}
    </Stack>
  );
};

export default PageWrapper;
