import Card from "@/components/card";
import DynamicProgress, { DEFAULT_RANGE } from "@/components/dynamic-progress";
import useDisksStore from "@/features/metrics/stores/disk.store";
import formatBytes from "@/features/metrics/utils/format-bytes";
import { commands } from "@/lib";
import { ActionIcon, Badge, Button, DefaultMantineColor, Group, Space, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconFolderOpen, IconInfoCircle } from "@tabler/icons-react";

interface DiskInformationAnalyticsCardProps {
  startDiskAnalysis: () => Promise<void>;
  startDiskAnalysisTurbo: () => Promise<void>;
}

const DiskInformationAnalyticsCard = (props: DiskInformationAnalyticsCardProps) => {
  const { startDiskAnalysis, startDiskAnalysisTurbo } = props;
  const disk = useDisksStore.use.selectedDisk();

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
      color: DEFAULT_RANGE.find((r) => disk.usedPercentage >= r.from && disk.usedPercentage <= r.to)?.color || "blue",
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
        <ActionIcon size={"sm"} variant="light" onClick={showDirectory}>
          <IconFolderOpen stroke={1.5} />
        </ActionIcon>
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
        <DynamicProgress size={36} sections={sections} />
        <Group>
          <Button radius="md" variant="gradient" style={{ flex: 1 }} onClick={startDiskAnalysis}>
            Scan
          </Button>
          <Button
            radius="md"
            style={{ flex: 1 }}
            variant="gradient"
            gradient={{ from: "orange", to: "red" }}
            onClick={startDiskAnalysisTurbo}
          >
            Turbo Scan
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export default DiskInformationAnalyticsCard;
