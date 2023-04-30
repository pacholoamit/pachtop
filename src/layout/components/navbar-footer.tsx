import useMediaQuery from "@/hooks/useMediaQuery";
import { Space, Text, Divider } from "@mantine/core";

const NavbarFooter = () => {
  const { isSmallerThanMd } = useMediaQuery();

  if (isSmallerThanMd) {
    return null;
  }

  return (
    <>
      <Divider />
      <Space h="xs" />
      <Text size="xs" color="dimmed" align="center" mt="xs">
        Made with ❤️ by Pacholo Amit
      </Text>
      <Text size="xs" color="dimmed" align="center" mt="xs">
        Version: {APP_VERSION}
      </Text>
      <Space h="xs" />
    </>
  );
};

export default NavbarFooter;
