import useServerEventsContext from "@/hooks/useServerEventsContext";
import PageWrapper from "@/components/page-wrapper";
import DiskNotFound from "@/features/metrics/components/disks/disk.notfound";
import Card from "@/components/card";
import { Text, Stack, Title, Center, Container, Button, Grid } from "@mantine/core";
import { Disk, commands } from "@/lib";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

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

  if (!id) return <DiskNotFound />;

  return (
    <PageWrapper name={id}>
      <Grid>
        <Grid.Col span={3}>
          <Card>
            <Title order={4}>Disk Information</Title>
            <Button onClick={() => onCheckDisk(disk.mountPoint)} color="blue">
              Click
            </Button>
          </Card>
        </Grid.Col>
        <Grid.Col span={9}>
          <Card>
            <Title order={4}>Disk Info</Title>
          </Card>
        </Grid.Col>
      </Grid>
    </PageWrapper>
  );
};

export default DiskAnalyticsPage;
