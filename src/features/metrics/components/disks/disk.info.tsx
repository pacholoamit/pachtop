import drive from "/drive.png";
import { useNavigate } from "react-router-dom";

import DynamicProgress, { DynamicProgressRangeInput } from "@/components/dynamic-progress";
import useDisksStore from "@/features/metrics/stores/disk.store";
import formatBytes from "@/features/metrics/utils/format-bytes";
import { Enumerable } from "@/hooks/useServerEventsEnumerableStore";
import { commands, Disk } from "@/lib";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Center,
  createStyles,
  Group,
  Image,
  Popover,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle, IconFolderOpen } from "@tabler/icons-react";

interface DiskInfoProps {
  disk: Disk;
}

const useStyles = createStyles((theme) => ({
  section: {
    borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  folder: {
    width: "20px",
    height: "20px",
  },
  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

const DiskDetailsSection: React.FC<{ disk?: Disk }> = ({ disk }) => {
  const range: DynamicProgressRangeInput[] = [
    { from: 0, to: 50, color: "#47d6ab" },
    { from: 50, to: 80, color: "yellow" },
    { from: 80, to: 100, color: "red" },
  ];

  const free = formatBytes(disk?.free || 0);
  const used = formatBytes(disk?.used || 0);
  const total = formatBytes(disk?.total || 0);

  const tooltip = `Total: ${total}\nUsed: ${used}\nFree: ${free}`;

  return (
    <>
      <Center>
        <Title order={6}>{disk?.name}</Title>
      </Center>
      <Image src={drive} alt="Drive" withPlaceholder />
      <Group position="apart">
        <Text size={"sm"}>Free: {free}</Text>

        <Popover position="left-end" withArrow shadow="md">
          <Popover.Target>
            <ActionIcon variant="transparent">
              <IconAlertCircle size="1rem" />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="xs" style={{ whiteSpace: "pre-line" }}>
              {tooltip}
            </Text>
          </Popover.Dropdown>
        </Popover>
      </Group>
      <DynamicProgress value={disk?.usedPercentage || 0} range={range} size={"xs"} />
    </>
  );
};

const DiskInfoSection: React.FC<{ disk?: Disk }> = ({ disk }) => {
  const data: { label: string; value: string; color: string }[] = [
    {
      label: "Location",
      value: disk?.mountPoint || "unknown",
      color: "blue",
    },
    {
      label: "Disk Type",
      value: disk?.diskType || "unknown",
      color: "yellow",
    },
    {
      label: "File System",
      value: disk?.fileSystem || "unknown",
      color: "cyan",
    },
  ];
  return (
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
  );
};

const DiskActionGroup: React.FC<{ disk: Disk }> = ({ disk }) => {
  const { classes } = useStyles();
  const setViewedDisk = useDisksStore((state) => state.setViewedDisk);
  const navigate = useNavigate();

  const showDirectory = async () => {
    if (!disk.mountPoint) return;
    await commands.showInFolder(disk.mountPoint);
  };

  // Encode this id to avoid any issues with special characters
  const onShowDetailsClick = () => {
    setViewedDisk(disk.name);
    navigate(`/disks/${encodeURI(disk.name)}`);
  };

  return (
    <Group mt="xs">
      <Button radius="md" style={{ flex: 1 }} onClick={onShowDetailsClick}>
        Disk Analysis
      </Button>
      <ActionIcon variant="default" radius="md" size={36} onClick={showDirectory}>
        <IconFolderOpen className={classes.folder} stroke={1.5} />
      </ActionIcon>
    </Group>
  );
};

const DiskStatsCard: React.FC<DiskInfoProps> = ({ disk }) => {
  const { classes } = useStyles();

  return (
    <Card shadow="xl" p="xs" radius={"md"} withBorder>
      <Card.Section className={classes.section}>
        <DiskDetailsSection disk={disk} />
      </Card.Section>
      <Card.Section className={classes.section}>
        <DiskInfoSection disk={disk} />
      </Card.Section>
      <DiskActionGroup disk={disk} />
    </Card>
  );
};

export default DiskStatsCard;
