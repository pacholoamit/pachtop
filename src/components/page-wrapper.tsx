import { Stack } from "@mantine/core";

interface PageWrapperProps {
  name: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, name }) => {
  return (
    <Stack spacing="xl">
      <h2>{name}</h2>
      {children}
    </Stack>
  );
};

export default PageWrapper;
