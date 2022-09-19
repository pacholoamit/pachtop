import { useMantineTheme } from "@mantine/core";
import { useMediaQuery as useMantineMediaQuery } from "@mantine/hooks";

const useMediaQuery = () => {
  const theme = useMantineTheme();

  const isSmallerThanLg = useMantineMediaQuery(
    `(max-width: ${theme.breakpoints.lg}px)`
  );

  return {
    isSmallerThanLg,
  };
};

export default useMediaQuery;
