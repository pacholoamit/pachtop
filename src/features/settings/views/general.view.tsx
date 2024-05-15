import { Grid, Select, Skeleton, Space, Switch } from "@mantine/core";
import { useEffect, useState } from "react";
import { autostart } from "@/lib";
import { useTheme } from "@/hooks/useTheme";
import { THEME_OPTION } from "../../../providers/theme.provider";

const GeneralSettingsView = () => {
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
      <Space h={"md"} />
      <Grid gutter={"xl"}>
        <Grid.Col span={12} style={{ fontSize: "1.2rem" }}>
          <Select
            defaultValue={currentTheme}
            label="Theme"
            data={[
              { value: THEME_OPTION.SLATE, label: "Slate" },
              { value: THEME_OPTION.MIDNIGHT, label: "Midnight" },
              { value: THEME_OPTION.BUMBLEBEE, label: "Bumblebee" },
            ]}
            onChange={(value) => setTheme(value as THEME_OPTION)}
          />
        </Grid.Col>
        <Grid.Col span={12} style={{ fontSize: "1.2rem" }}>
          <Switch checked={checked} onChange={onChange} label="Start on system startup" />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default GeneralSettingsView;
