import { useEffect, useState } from "react";
import GitHubButton from "react-github-btn";
import PageWrapper from "@/components/page-wrapper";
import Card from "@/components/card";
import { Grid, Skeleton, Space, Stack, Switch, Title, Text, SegmentedControl, Group, ThemeIcon } from "@mantine/core";
import { useTheme } from "@/hooks/useTheme";
import { autostart } from "@/lib";
import { THEME_OPTION } from "@/providers/theme.provider";
import { LinearGradient } from "react-text-gradients";

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
      <Card style={{ padding: "16px", height: "80vh" }}>
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
