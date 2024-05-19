import { DefaultMantineColor, Title, Space, Stack, Group, Badge, Text } from "@mantine/core";
import { Disk } from "@/lib";

import Card from "@/components/card";
import formatBytes from "@/features/metrics/utils/format-bytes";

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

export default DiskInformationAnalyticsCard;
