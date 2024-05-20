import React from 'react';

import { Divider, MediaQuery, Space, Text } from '@mantine/core';
import { getVersion } from '@tauri-apps/api/app';

const NavbarFooter = () => {
  const [version, setVersion] = React.useState<string>("");

  React.useEffect(() => {
    getVersion().then((v) => setVersion(v));
  }, []);

  return (
    <>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Divider />
      </MediaQuery>
      <Space h="xs" />
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Text size="xs" color="dimmed" align="center" mt="xs" mb="xs">
          Made with ❤️ by Pacholo Amit
        </Text>
      </MediaQuery>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Text size="xs" color="dimmed" align="center" mt="xs" mb="xs">
          Version: {version}
        </Text>
      </MediaQuery>
      <Space h="xs" />
    </>
  );
};

export default NavbarFooter;
