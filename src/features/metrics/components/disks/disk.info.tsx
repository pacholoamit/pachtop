import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Stack,
  Image,
  Text,
  createStyles,
  Button,
  Center,
  Title,
  Tooltip,
} from "@mantine/core";
import { Enumerable } from "@/hooks/useServerEventsEnumerableStore";
import { Disk, commands } from "@/lib";
import { IconFolderOpen } from "@tabler/icons-react";
import DynamicProgress, { DynamicProgressRangeInput } from "@/components/dynamic-progress";
import drive from "/drive.png";
import formatBytes from "@/features/metrics/utils/format-bytes";
import notification from "../../../../utils/notification";

interface DiskInfoProps {
  disk: Enumerable<Disk>;
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
    { from: 0, to: 50, color: "green" },
    { from: 50, to: 80, color: "yellow" },
    { from: 80, to: 100, color: "red" },
  ];

  return (
    <>
      <Center>
        <Title order={6}>{disk?.name}</Title>
      </Center>
      <Image src={drive} alt="Drive" withPlaceholder />
      <Text size={"sm"}>Free: {formatBytes(disk?.free || 0)}</Text>
      <DynamicProgress value={disk?.usedPercentage || 0} range={range} />
    </>
  );
};

const DiskInfoSection: React.FC<{ disk?: Disk }> = ({ disk }) => {
  return (
    <Stack spacing={3}>
      <Group position="apart">
        <Text c="dimmed" size={"sm"}>
          Location
        </Text>
        <Badge size="sm" variant="light" color="indigo">
          {disk?.mountPoint}
        </Badge>
      </Group>
      <Group position="apart" align="center">
        <Text c="dimmed" size={"sm"}>
          Disk Type
        </Text>
        <Badge size="sm" variant="light" color="red">
          {disk?.diskType}
        </Badge>
      </Group>
      <Group position="apart">
        <Text c="dimmed" size={"sm"}>
          File System
        </Text>
        <Badge size="sm" variant="light" color="grape">
          {disk?.fileSystem}
        </Badge>
      </Group>
    </Stack>
  );
};

const DiskActionGroup: React.FC<{ onShowDirectory: () => void }> = ({ onShowDirectory }) => {
  const { classes } = useStyles();
  const onShowDetailsClick = () => {
    notification.error({
      message: "Feature coming soon! 🙏",
      title: "Thank you for your patience",
    });
  };
  return (
    <Group mt="xs">
      <Button radius="md" style={{ flex: 1 }} onClick={onShowDetailsClick}>
        Show details
      </Button>
      <ActionIcon variant="default" radius="md" size={36} onClick={onShowDirectory}>
        <IconFolderOpen className={classes.folder} stroke={1.5} />
      </ActionIcon>
    </Group>
  );
};

const DiskStatsCard: React.FC<DiskInfoProps> = ({ disk }) => {
  const last = disk.data.at(-1);
  const { classes } = useStyles();

  const showDirectory = async () => {
    if (!last?.mountPoint) return;
    await commands.showInFolder(last.mountPoint);
  };

  const onCheckDisk = async (mountPoint: string) => {
    console.log("Checking disk", mountPoint);
    await commands.deepScan({ path: mountPoint }).then((res) => {
      console.log(res);
    });
  };

  return (
    <Card shadow="xl" p="xs" radius={"md"} withBorder>
      <Card.Section className={classes.section}>
        <DiskDetailsSection disk={last} />
      </Card.Section>
      <Card.Section className={classes.section}>
        <DiskInfoSection disk={last} />
      </Card.Section>
      <DiskActionGroup onShowDirectory={showDirectory} />
    </Card>
  );
};

export default DiskStatsCard;
