import useServerEventsContext from "@/hooks/useServerEventsContext";
import DiskInfo from "@/features/metrics/components/disks/disk.info";
import PageWrapper from "@/components/page-wrapper";
import { Grid } from "@mantine/core";
import React from "react";

const DisksPage = () => {
  const { disks } = useServerEventsContext();
  return (
    <PageWrapper name="Disks">
      <Grid>
        {disks?.map((disk) => (
          <React.Fragment key={disk.id}>
            <Grid.Col md={6} sm={12}></Grid.Col>
            <Grid.Col md={6} sm={12} key={disk.id}>
              <DiskInfo key={disk.id} disk={disk} />
            </Grid.Col>
          </React.Fragment>
        ))}
      </Grid>
    </PageWrapper>
  );
};

export default DisksPage;
