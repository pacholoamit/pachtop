import React from "react";
import GeneralSettingsView from "@/features/settings/views/general.view";
import AboutView from "@/features/settings/views/about.view";
import PageWrapper from "@/components/page-wrapper";
import Card from "@/components/card";

import { IconGitBranch, IconSettings2 } from "@tabler/icons-react";
import { Center, Grid, NavLink } from "@mantine/core";
import { useState } from "react";

const settings = [
  { icon: IconSettings2, label: "General", view: <GeneralSettingsView /> },

  // TODO: FIX responsiveness
  // {
  //   icon: IconGitBranch,
  //   label: "About",
  //   view: <AboutView />,
  // },
];

const SettingsPage = () => {
  const [active, setActive] = useState(0);

  const items = settings.map((item, index) => (
    <React.Fragment key={item.label}>
      <Grid.Col span={3}>
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
    <PageWrapper name="Settings" height={"94vh"}>
      <Center>
        <Card style={{ height: "85vh" }}>
          <Grid style={{ width: "80rem" }}>{items}</Grid>
        </Card>
      </Center>
    </PageWrapper>
  );
};

export default SettingsPage;
