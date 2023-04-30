import useMediaQuery from "@/hooks/useMediaQuery";
import { Space, Text, Divider } from "@mantine/core";
import { getVersion } from "@tauri-apps/api/app";
import React from "react";

const NavbarFooter = () => {
  const { isSmallerThanMd } = useMediaQuery();
  const [version, setVersion] = React.useState<string>("");

  React.useEffect(() => {
    getVersion().then((v) => setVersion(v));
  }, []);

  if (isSmallerThanMd) {
    return null;
  }

  return (
    <>
      <Divider />
      <Space h="xs" />
      <Text size="xs" color="dimmed" align="center" mt="xs" mb="xs">
        Made with ❤️ by Pacholo Amit
      </Text>
      <Text size="xs" color="dimmed" align="center" mt="xs" mb="xs">
        Version: {version}
      </Text>
      <Space h="xs" />
    </>
  );
};

export default NavbarFooter;
