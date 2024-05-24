import React from "react";

import PageWrapper from "@/components/page-wrapper";
import DiskInfo from "@/features/metrics/components/disks/disk.info";
import useDisksStore from "@/features/metrics/stores/disk.store";
import { Grid } from "@mantine/core";

const DisksPage = () => {
  const disks = useDisksStore((state) => state.disks);

  return (
    <PageWrapper name="Disks">
      <Grid>
        {disks.map((disk, i) => (
          <React.Fragment key={i}>
            <Grid.Col xl={2} lg={3} xs={6}>
              <DiskInfo disk={disk} />
            </Grid.Col>
          </React.Fragment>
        ))}
      </Grid>
    </PageWrapper>
  );
};

export default DisksPage;
