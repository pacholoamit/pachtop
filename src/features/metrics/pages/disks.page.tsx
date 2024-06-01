import React, { memo } from "react";
import { useShallow } from "zustand/react/shallow";

import PageWrapper from "@/components/page-wrapper";
import DiskInfo from "@/features/metrics/components/disks/disk.info";
import useDisksStore from "@/features/metrics/stores/disk.store";
import { Disk } from "@/lib";
import { Grid } from "@mantine/core";

const DiskInfoSection = () => {
  const disks = useDisksStore(
    useShallow((state) => {
      return state.disks.map((d) => ({
        ...d,
        timestamp: 0,
      }));
    })
  );

  return (
    <>
      {disks.map((disk, i) => (
        <React.Fragment key={i}>
          <Grid.Col xl={2} lg={3} xs={6}>
            <DiskInfo disk={disk} />
          </Grid.Col>
        </React.Fragment>
      ))}
    </>
  );
};

const DisksPage = () => {
  return (
    <PageWrapper name="Disks">
      <Grid>
        <DiskInfoSection />
      </Grid>
    </PageWrapper>
  );
};

export default DisksPage;
