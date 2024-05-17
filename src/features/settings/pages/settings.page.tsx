import React, { useEffect, useState } from "react";

import PageWrapper from "@/components/page-wrapper";
import Card from "@/components/card";
import {
  Grid,
  NavLink,
  Select,
  Skeleton,
  Space,
  Stack,
  Switch,
  Title,
  Text,
  SegmentedControl,
  Input,
  Divider,
  Group,
  ThemeIcon,
} from "@mantine/core";
import { useTheme } from "@/hooks/useTheme";
import { autostart } from "@/lib";
import { THEME_OPTION } from "@/providers/theme.provider";
import { IconBrandGithub } from "@tabler/icons-react";

const GeneralSectionInfo = () => {
  return (
    <>
      <Title order={4}>General</Title>
      <Text c="dimmed" size={"sm"}>
        Customize your application settings.
      </Text>
    </>
  );
};
const GeneralSection = () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const checkAutoStart = async () => setChecked(await autostart.isEnabled());
  const { setTheme, currentTheme } = useTheme();

  useEffect(() => {
    checkAutoStart();
    setLoading(false);
  }, [checkAutoStart]);

  const onChange = () => {
    if (!checked) {
      autostart.enable();
    } else {
      autostart.disable();
    }
    setChecked(!checked);
  };

  if (loading) {
    return (
      <>
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </>
    );
  }

  return (
    <>
      <Grid gutter={"xl"}>
        <Grid.Col span={12} style={{ fontSize: "1.2rem" }}>
          <Text size={"sm"} color="white">
            Theme
          </Text>
          <SegmentedControl
            defaultValue={currentTheme}
            size="xs"
            onChange={(value) => setTheme(value as THEME_OPTION)}
            data={[
              { value: THEME_OPTION.SLATE, label: "Slate" },
              { value: THEME_OPTION.MIDNIGHT, label: "Midnight" },
              { value: THEME_OPTION.BUMBLEBEE, label: "Bumblebee" },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={12} style={{ fontSize: "1.2rem" }}>
          <Switch checked={checked} onChange={onChange} label="Start on system startup" />
        </Grid.Col>
      </Grid>
    </>
  );
};

const AboutSectionInfo = () => {
  return (
    <>
      <Title order={4}>About</Title>
      <Text c="dimmed" size={"sm"}>
        Get information about the application.
      </Text>
    </>
  );
};
const BuyMeACoffee = () => {
  return (
    <a href="https://www.buymeacoffee.com/pacholoamit" target="_blank" rel="noopener noreferrer">
      <img
        src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png"
        alt="Buy Me A Coffee"
        style={{
          height: "41px",
          width: "174px",
          boxShadow: "0px 3px 2px 0px rgba(190, 190, 190, 0.5)",
          WebkitBoxShadow: "0px 3px 2px 0px rgba(190, 190, 190, 0.5)",
        }}
      />
    </a>
  );
};
const AboutSection = () => {
  return (
    <Stack spacing={"lg"}>
      <Text>
        Pachtop will always remain open-source and free to use. If you like the project, please consider giving it a
        star on Github or buy me a coffee.
      </Text>
      <Group>
        <a href="https://github.com/pacholoamit/pachtop" target="_blank" rel="noopener noreferrer">
          <ThemeIcon variant="light" size={"xl"} radius={"xl"}>
            <IconBrandGithub />
          </ThemeIcon>
        </a>
        <BuyMeACoffee />
      </Group>
    </Stack>
  );
};

const SettingsPage = () => {
  return (
    <PageWrapper name="Settings">
      <Card style={{ padding: "16px", height: "100%" }}>
        <Stack justify="space-around" spacing={"lg"}>
          <Grid grow>
            <Grid.Col span={4}>
              <GeneralSectionInfo />
            </Grid.Col>
            <Grid.Col span={4}>
              <GeneralSection />
            </Grid.Col>
            <Grid.Col span={4}></Grid.Col>
            <Grid.Col span={4}>
              <Space h={"xl"} />
              <AboutSectionInfo />
            </Grid.Col>
            <Grid.Col span={4}>
              <Space h={"xl"} />
              <AboutSection />
            </Grid.Col>
            <Grid.Col span={4}></Grid.Col>
          </Grid>
        </Stack>
      </Card>
    </PageWrapper>
  );
};

export default SettingsPage;
