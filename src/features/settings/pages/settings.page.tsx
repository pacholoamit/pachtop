import PageWrapper from "@/components/page-wrapper";
import Card from "@/components/card";
import { Icon24Hours } from "@tabler/icons-react";
import { Center, Grid, NavLink, Skeleton, Switch } from "@mantine/core";
import { useEffect, useState } from "react";
import React from "react";
import { autostart } from "@/lib";

const AutoStartSettings = () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const checkAutoStart = async () => setChecked(await autostart.isEnabled());

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
  return <Switch checked={checked} onChange={onChange} label="Start on system startup" />;
};

const settings = [{ icon: Icon24Hours, label: "Auto Start", view: <AutoStartSettings /> }];

const SettingsPage = () => {
  const [active, setActive] = useState(0);
  const items = settings.map((item, index) => (
    <React.Fragment key={item.label}>
      <Grid.Col span={4}>
        <NavLink
          key={item.label}
          active={index === active}
          label={item.label}
          icon={<item.icon size="1rem" stroke={1.5} />}
          onClick={() => {
            setActive(index);
          }}
        />
      </Grid.Col>
      <Grid.Col span={8}>{index === active && item.view}</Grid.Col>
    </React.Fragment>
  ));

  return (
    <PageWrapper name="Settings">
      <Center>
        <Card>
          <Grid style={{ width: "45rem" }}>{items}</Grid>
        </Card>
      </Center>
    </PageWrapper>
  );
};

export default SettingsPage;
