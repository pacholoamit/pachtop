import useServerEventsContext from "@/hooks/useServerEventsContext";
import PageWrapper from "@/components/page-wrapper";
import DiskNotFound from "@/features/metrics/components/disks/disk.notfound";
import Card from "@/components/card";
import { Title, Grid } from "@mantine/core";
import { Disk, commands } from "@/lib";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import DiskInformationAnalyticsCard from "@/features/metrics/components/disks/disk.information-analytcs";

interface DiskAnalyticsPageProps {}

const defaultDisk: Disk = {
  diskType: "unknown",
  fileSystem: "unknown",
  free: 0,
  isRemovable: false,
  mountPoint: "unknown",
  total: 0,
  name: "unknown",
  timestamp: BigInt(0),
  used: 0,
  usedPercentage: 0,
};

const DiskAnalyticsPage: React.FC<DiskAnalyticsPageProps> = () => {
  const { disks } = useServerEventsContext();
  const { id = "" } = useParams();
  const [disk, setDisk] = React.useState<Disk>(defaultDisk);

  // Stop if no disk id
  if (!id) return <DiskNotFound />;

  useEffect(() => {
    if (!disks) return;
    const disk = disks.find((d) => d.id === id);

    if (disk?.data?.length ?? 0 > 0) {
      setDisk(disk?.data?.at(-1) || defaultDisk);
    }
  }, [disks]);

  const onCheckDisk = async (mountPoint: string) => {
    console.log("Checking disk", mountPoint);
    await commands.deepScan({ path: mountPoint }).then((res) => {
      console.log(res);
    });
  };

  return (
    <PageWrapper name={id}>
      <Grid>
        <Grid.Col span={3}>
          <DiskInformationAnalyticsCard disk={disk} />
        </Grid.Col>
        <Grid.Col span={9}>
          <Card>
            <Title order={4}>Disk Analysis</Title>
          </Card>
        </Grid.Col>
      </Grid>
    </PageWrapper>
  );
};

export default DiskAnalyticsPage;
