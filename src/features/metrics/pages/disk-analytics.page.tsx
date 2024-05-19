import useServerEventsContext from "@/hooks/useServerEventsContext";
import PageWrapper from "@/components/page-wrapper";
import DiskNotFound from "@/features/metrics/components/disks/disk.notfound";
import Card from "@/components/card";
import { Title, Grid, Group, Button, Stack, Loader, Center } from "@mantine/core";
import { Disk, DiskItem, commands } from "@/lib";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import DiskInformationAnalyticsCard from "@/features/metrics/components/disks/disk.information-analytics";

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
  const [analysis, setAnalysis] = React.useState<DiskItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  const onCheckDisk = async (mountPoint: string) => {
    console.log("Checking disk", mountPoint);
    setLoading(true);
    await commands.deepScan({ path: mountPoint }).then((res) => {
      setAnalysis(res);
    });
    setLoading(false);
  };

  // Stop if no disk id
  if (!id) return <DiskNotFound />;

  useEffect(() => {
    if (!disks) return;
    const disk = disks.find((d) => d.id === id);

    if (disk?.data?.length ?? 0 > 0) {
      setDisk(disk?.data?.at(-1) || defaultDisk);
    }
  }, [disks]);

  return (
    <PageWrapper name={id}>
      <Grid>
        <Grid.Col span={3}>
          <DiskInformationAnalyticsCard disk={disk} />
        </Grid.Col>
        <Grid.Col span={9}>
          <Card height="350px">
            <Group position="apart">
              <Title order={4}>Disk Analysis</Title>
              <Button onClick={() => onCheckDisk(disk.mountPoint)}>Start Analysis</Button>
            </Group>
            {loading && (
              <Center>
                <Loader />
              </Center>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </PageWrapper>
  );
};

export default DiskAnalyticsPage;
