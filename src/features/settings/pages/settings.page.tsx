import { useEffect, useState } from "react";
import GitHubButton from "react-github-btn";
import { LinearGradient } from "react-text-gradients";

import Card from "@/components/card";
import PageWrapper from "@/components/page-wrapper";
import useTheme from "@/hooks/useTheme";
import { autostart } from "@/lib";
import { THEME_OPTION } from "@/providers/theme.provider";
import notification from "@/utils/notification";
import { Button, Grid, Group, SegmentedControl, Space, Stack, Switch, Text, Title } from "@mantine/core";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";

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
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const checkAutoStart = async () => setChecked(await autostart.isEnabled());
  const { setTheme, currentTheme } = useTheme();

  const onCheckUpdate = async () => {
    setIsUpdateLoading(true);
    const update = await checkUpdate().then((res) => {
      setIsUpdateLoading(false);
      return res;
    });

    if (update.shouldUpdate) {
      notification.success({
        title: "🥳 Update available",
        message: `New Pachtop version available.`,
      });

      await installUpdate();
      return;
    }

    notification.success({
      title: "🥳 No updates",
      message: `You are already using the latest version of Pachtop.`,
    });
  };

  useEffect(() => {
    checkAutoStart();
  }, [checkAutoStart]);

  const onChange = () => {
    if (!checked) {
      autostart.enable();
    } else {
      autostart.disable();
    }
    setChecked(!checked);
  };

  return (
    <Grid gutter={"xl"}>
      <Grid.Col span={12} style={{ fontSize: "1.2rem" }}>
        <Stack spacing={4} align="flex-start">
          <Text size="sm">Check for updates</Text>
          <Button loading={isUpdateLoading} onClick={onCheckUpdate} variant="outline">
            Update
          </Button>
        </Stack>
      </Grid.Col>
      <Grid.Col span={12} style={{ fontSize: "1.2rem" }}>
        <Stack spacing={4} align="flex-start">
          <Text size={"sm"}>Theme</Text>
          <SegmentedControl
            defaultValue={currentTheme}
            size="xs"
            onChange={(value) => setTheme(value as THEME_OPTION)}
            data={[
              { value: THEME_OPTION.SLATE, label: "Slate" },
              { value: THEME_OPTION.MIDNIGHT, label: "Midnight" },
            ]}
          />
        </Stack>
      </Grid.Col>
      <Grid.Col span={12} style={{ fontSize: "1.2rem" }}>
        <Stack spacing={4} align="flex-start">
          <Text size={"sm"}>Start on system startup</Text>
          <Switch checked={checked} onChange={onChange} />
        </Stack>
      </Grid.Col>
    </Grid>
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
          height: "26px",
          width: "96px",
          marginBottom: "8px",
        }}
      />
    </a>
  );
};
const AboutSection = () => {
  return (
    <Stack spacing={"lg"}>
      <Text>Pachtop will always remain open-source and free to use. 🤗</Text>
      <Group>
        <BuyMeACoffee />
        <GitHubButton
          href="https://github.com/sponsors/pacholoamit"
          // data-color-scheme="no-preference: dark; light: dark; dark: dark;"
          data-icon="octicon-heart"
          data-size="large"
          aria-label="Sponsor @pacholoamit on GitHub"
        >
          Sponsor
        </GitHubButton>

        <GitHubButton
          href="https://github.com/pacholoamit/pachtop"
          // data-color-scheme="no-preference: dark; light: dark; dark: dark;"
          data-icon="octicon-star"
          data-size="large"
          data-show-count="true"
          aria-label="Star pacholoamit/pachtop on GitHub"
        >
          Star
        </GitHubButton>
      </Group>
    </Stack>
  );
};

const SponsorsSectionInfo = () => {
  return (
    <>
      <Title order={4}>Sponsors</Title>
      <Text c="dimmed" size={"sm"}>
        A big shoutout to these amazing people who sponsored the project. Your support means a lot to me. ❤️
      </Text>
    </>
  );
};

const SponsorsSection = () => {
  return (
    <Stack spacing={"lg"}>
      <Title order={1}>
        <LinearGradient gradient={["to left", "#17acff ,#ff68f0"]}>Coming soon...</LinearGradient>
      </Title>
    </Stack>
  );
};

const SettingsPage = () => {
  return (
    <PageWrapper name="Settings">
      <Card style={{ padding: "16px", height: "85vh" }}>
        <Stack justify="space-around" spacing={"lg"}>
          <Grid grow>
            <Grid.Col span={4}>
              <GeneralSectionInfo />
            </Grid.Col>
            <Grid.Col span={4}>
              <GeneralSection />
            </Grid.Col>
            <Grid.Col span={4} />
            <Grid.Col span={4}>
              <Space h={"xl"} />
              <AboutSectionInfo />
            </Grid.Col>
            <Grid.Col span={4}>
              <Space h={"xl"} />
              <AboutSection />
            </Grid.Col>
            <Grid.Col span={4} />
            <Grid.Col span={4}>
              <Space h={"xl"} />
              <SponsorsSectionInfo />
            </Grid.Col>
            <Grid.Col span={4}>
              <Space h={"xl"} />
              <Space h={"xl"} />
              <SponsorsSection />
            </Grid.Col>
            <Grid.Col span={4} />
          </Grid>
        </Stack>
      </Card>
    </PageWrapper>
  );
};

export default SettingsPage;
