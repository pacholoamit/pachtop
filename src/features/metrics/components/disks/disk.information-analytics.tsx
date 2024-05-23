import Card from "@/components/card";
import DynamicProgress, { DynamicProgressRangeInput } from "@/components/dynamic-progress";
import useDisksStore from "@/features/metrics/stores/disk.store";
import formatBytes from "@/features/metrics/utils/format-bytes";
import { commands, Disk } from "@/lib";
import { ActionIcon, Badge, Button, DefaultMantineColor, Group, Space, Stack, Text, Title } from "@mantine/core";
import { IconFolderOpen } from "@tabler/icons-react";

interface DiskInformationAnalyticsCardProps {
  startDiskAnalysis: () => Promise<void>;
}

const range: DynamicProgressRangeInput[] = [
  { from: 0, to: 50, color: "#47d6ab" },
  { from: 50, to: 80, color: "yellow" },
  { from: 80, to: 100, color: "red" },
];

const DiskInformationAnalyticsCard = (props: DiskInformationAnalyticsCardProps) => {
  const { startDiskAnalysis } = props;
  const disk = useDisksStore((state) => state.selectedDisk);

  const data: { label: string; value: string; color: DefaultMantineColor }[] = [
    {
      label: "Location",
      value: disk.mountPoint,
      color: "blue",
    },
    {
      label: "Disk Type",
      value: disk.diskType,
      color: "yellow",
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
      color: "violet",
    },
  ];
  const sections = [
    {
      value: disk.usedPercentage,
      color: range.find((r) => disk.usedPercentage >= r.from && disk.usedPercentage <= r.to)?.color || "blue",
      label: disk.usedPercentage + "%",
    },
  ];
  const showDirectory = async () => {
    await commands.showInFolder(disk.mountPoint);
  };

  return (
    <Card height="350px">
      <Group position="apart">
        <Title order={4}>Disk Information</Title>
      </Group>
      <Space h={8} />

      <Stack spacing={"lg"}>
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
        <DynamicProgress size={34} range={range} sections={sections} />
        <Group>
          <ActionIcon variant="default" radius="md" size={36} onClick={showDirectory}>
            <IconFolderOpen stroke={1.5} />
          </ActionIcon>
          <Button radius="md" style={{ flex: 1 }} variant="outline" onClick={startDiskAnalysis}>
            Start Disk Analysis
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export default DiskInformationAnalyticsCard;
