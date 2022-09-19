import { useMantineTheme } from "@mantine/core";
import { useMediaQuery as useMantineMediaQuery } from "@mantine/hooks";

const useMediaQuery = () => {
  const theme = useMantineTheme();

  const isSmallerThanLg = useMantineMediaQuery(
    `(max-width: ${theme.breakpoints.lg}px)`
  );

  const isSmallerThanMd = useMantineMediaQuery(
    `(max-width: ${theme.breakpoints.md}px)`
  );

  const isLargerThanXl = useMantineMediaQuery(
    `(min-width: ${theme.breakpoints.xl}px)`
  );

  const isSmallerThanXs = useMantineMediaQuery(
    `(max-width: ${theme.breakpoints.xs}px)`
  );

  return {
    isSmallerThanLg,
    isSmallerThanMd,
    isLargerThanXl,
    isSmallerThanXs,
  };
};

export default useMediaQuery;
