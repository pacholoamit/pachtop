import React from "react";
import AutoStartSettingsView from "@/features/settings/views/autostart.view";
import PageWrapper from "@/components/page-wrapper";
import Card from "@/components/card";

import { Icon24Hours } from "@tabler/icons-react";
import { Center, Grid, NavLink } from "@mantine/core";
import { useState } from "react";

const settings = [{ icon: Icon24Hours, label: "Auto Start", view: <AutoStartSettingsView /> }];

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
