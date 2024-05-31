import React, { memo } from 'react';

import PageWrapper from '@/components/page-wrapper';
import DiskInfo from '@/features/metrics/components/disks/disk.info';
import useDisksStore from '@/features/metrics/stores/disk.store';
import { Disk } from '@/lib';
import { Grid } from '@mantine/core';

// Memoize the DiskInfo component
const MemoizedDiskInfo = memo<{ disk: Disk }>(({ disk }) => <DiskInfo disk={disk} />);

const DisksPage = () => {
  const disks = useDisksStore((state) => state.disks);

  return (
    <PageWrapper name="Disks">
      <Grid>
        {disks.map((disk, i) => (
          <React.Fragment key={i}>
            <Grid.Col xl={2} lg={3} xs={6}>
              <MemoizedDiskInfo disk={disk} />
            </Grid.Col>
          </React.Fragment>
        ))}
      </Grid>
    </PageWrapper>
  );
};

export default DisksPage;
