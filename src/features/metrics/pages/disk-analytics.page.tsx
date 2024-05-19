import useServerEventsContext from "@/hooks/useServerEventsContext";
import PageWrapper from "@/components/page-wrapper";
import DiskNotFound from "@/features/metrics/components/disks/disk.notfound";
import Card from "@/components/card";
import {
  Text,
  Stack,
  Title,
  Center,
  Container,
  Button,
  Grid,
  Group,
  Badge,
  Space,
  DefaultMantineColor,
} from "@mantine/core";
import { Disk, commands } from "@/lib";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import formatBytes from "../utils/format-bytes";

const DiskInformationAnalyticsCard = ({ disk }: { disk: Disk }) => {
  const data: { label: string; value: string; color: DefaultMantineColor }[] = [
    {
      label: "Disk Type",
      value: disk.diskType,
      color: "blue",
    },
    {
      label: "File System",
      value: disk.fileSystem,
      color: "cyan",
    },
    {
      label: "Removable",
      value: disk.isRemovable ? "Yes" : "No",
      color: "lime",
    },
    {
      label: "Free Space",
      value: formatBytes(disk.free),
      color: "green",
    },
    {
      label: "Used Space",
      value: formatBytes(disk.used),
      color: "red",
    },
    {
      label: "Total Space",
      value: formatBytes(disk.total),
      color: "gray",
    },
  ];

  return (
    <Card>
      <Title order={4}>Disk Information</Title>
      <Space h={8} />
      <Stack spacing={3}>
        {data.map((d, i) => (
          <Group key={i} position="apart">
            <Text c="dimmed" size={"sm"}>
              {d.label}
            </Text>
            <Badge size="sm" variant="light" color={d.color}>
              {d.value}
            </Badge>
          </Group>
        ))}
      </Stack>
    </Card>
  );
};

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
