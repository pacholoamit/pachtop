import useServerEventsContext from "@/hooks/useServerEventsContext";
import DiskInfo from "@/features/metrics/components/disks/disk.info";
import PageWrapper from "@/components/page-wrapper";
import { Alert, Grid } from "@mantine/core";
import React from "react";
import { IconAlertCircle } from "@tabler/icons-react";

const DisksPage = () => {
  const { disks } = useServerEventsContext();

  return (
    <PageWrapper name="Disks">
      <Grid>
        {disks?.map((disk, i) => (
          <React.Fragment key={disk.id + i}>
            <Grid.Col xl={2} lg={3} xs={6}>
              <DiskInfo key={disk.id} disk={disk} />
            </Grid.Col>
          </React.Fragment>
        ))}
      </Grid>
    </PageWrapper>
  );
};

export default DisksPage;
