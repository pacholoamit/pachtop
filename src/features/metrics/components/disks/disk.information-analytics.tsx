import Card from "@/components/card";
import DynamicProgress, { DEFAULT_RANGE } from "@/components/dynamic-progress";
import useDisksStore from "@/features/metrics/stores/disk.store";
import formatBytes from "@/features/metrics/utils/format-bytes";
import { commands } from "@/lib";
import logger from "@/lib/logger";
import notification from "@/utils/notification";
import {
  ActionIcon,
  Badge,
  Button,
  DefaultMantineColor,
  Group,
  Popover,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertCircle, IconFolderOpen } from "@tabler/icons-react";

interface DiskInformationAnalyticsCardProps {
  startDiskAnalysis: () => Promise<void>;
}

const DiskInformationAnalyticsCard = (props: DiskInformationAnalyticsCardProps) => {
  const { startDiskAnalysis } = props;
  const [opened, { close, open }] = useDisclosure(false);
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
    await commands.open(disk.mountPoint).catch((err) => {
      notification.error({
        title: "Error opening directory",
        message: "An error occurred while trying to open the directory.",
      });
      logger.error("Error opening directory: ", err);
    });
  };

  return (
    <Popover width={200} position="top" withArrow shadow="md" opened={opened}>
      <Card height="400px">
        <Group position="apart">
          <Title order={4}>Disk Information</Title>
          <ActionIcon size={"sm"} variant="light" onClick={showDirectory}>
            <IconFolderOpen stroke={1.5} />
          </ActionIcon>
        </Group>
        <Space h={16} />

        <Stack spacing={"lg"}>
          <Stack spacing={4}>
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
          <Space h={12} />
          <DynamicProgress size={36} sections={sections} />
          <Group>
            <Button radius="md" variant="gradient" style={{ flex: 1 }} onClick={startDiskAnalysis}>
              Scan
            </Button>
            <Popover.Target>
              <Button
                radius="md"
                style={{ flex: 1 }}
                variant="gradient"
                gradient={{ from: "orange", to: "red" }}
                onClick={startDiskAnalysis}
                leftIcon={<IconAlertCircle />}
                onMouseEnter={open}
                onMouseLeave={close}
              >
                Turbo Scan
              </Button>
            </Popover.Target>
          </Group>
        </Stack>
      </Card>
      <Popover.Dropdown>
        <Text size={"sm"}>
          <Text variant="gradient" fw={1000} gradient={{ from: "orange", to: "red" }}>
            Turbo Scan
          </Text>{" "}
          leverages multiple system threads to perform scans in parallel, significantly boosting speed. This may cause a
          temporary increase in CPU resource usage.
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
};

export default DiskInformationAnalyticsCard;
