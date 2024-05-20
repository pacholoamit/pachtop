import { useMantineTheme } from '@mantine/core';
import { useMediaQuery as useMantineMediaQuery } from '@mantine/hooks';

const useMediaQuery = () => {
  const theme = useMantineTheme();

  const isSmallerThanLg = useMantineMediaQuery(`(max-width: ${theme.breakpoints.lg}rem)`);

  const isSmallerThanMd = useMantineMediaQuery(`(max-width: ${theme.breakpoints.md}rem)`);

  const isLargerThanXl = useMantineMediaQuery(`(min-width: ${theme.breakpoints.xl}rem)`);

  const isSmallerThanXs = useMantineMediaQuery(`(max-width: ${theme.breakpoints.xs}rem)`);

  return {
    isSmallerThanLg,
    isSmallerThanMd,
    isLargerThanXl,
    isSmallerThanXs,
  };
};

export default useMediaQuery;
