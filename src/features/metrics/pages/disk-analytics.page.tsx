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
  const [diskAnalysis, setDiskAnalysis] = React.useState<DiskItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  const startDiskAnalysis = async () => {
    setLoading(true);
    await commands.deepScan({ path: disk.mountPoint }).then((res) => {
      setDiskAnalysis(res);
      setLoading(false);
    });
  };

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
          <DiskInformationAnalyticsCard disk={disk} startDiskAnalysis={startDiskAnalysis} />
        </Grid.Col>
        <Grid.Col span={9}>
          <Card height="350px">
            <Group position="apart">
              <Title order={4}>Disk Analysis</Title>
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
