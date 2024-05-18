import { ActionIcon, Badge, Card, Group, Stack, Image, Text, createStyles, Button, Center, Title } from "@mantine/core";
import { Enumerable } from "@/hooks/useServerEventsEnumerableStore";
import { Disk, commands } from "@/lib";
import { IconCheck, IconFolderOpen, IconX } from "@tabler/icons-react";
import DynamicProgress, { DynamicProgressRangeInput } from "@/components/dynamic-progress";
import drive from "/drive.png";
import formatBytes from "@/features/metrics/utils/format-bytes";

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

const onCheckDisk = async (mountPoint: string) => {
  console.log("Checking disk", mountPoint);
  await commands.deepScan({ path: mountPoint }).then((res) => {
    console.log(res);
  });
};

interface DiskInfoProps {
  disk: Enumerable<Disk>;
}

const DiskTitleImage: React.FC<{ name?: string }> = ({ name }) => {
  const { classes } = useStyles();

  return (
    <Card.Section className={classes.section}>
      <Center>
        <Title order={6}>{name}</Title>
      </Center>
      <Image src={drive} alt="Drive" withPlaceholder />
    </Card.Section>
  );
};

const DiskDetails: React.FC<{ last: any }> = ({ last }) => {
  const { classes } = useStyles();

  return (
    <Card.Section className={classes.section}>
      <Stack spacing={3}>
        <Group position="apart">
          <Text c="dimmed" size={"sm"}>
            Location
          </Text>
          <Badge size="sm" variant="light" color="indigo">
            {last?.mountPoint}
          </Badge>
        </Group>
        <Group position="apart" align="center">
          <Text c="dimmed" size={"sm"}>
            Disk Type
          </Text>
          <Badge size="sm" variant="light" color="red">
            {last?.diskType}
          </Badge>
        </Group>
        <Group position="apart">
          <Text c="dimmed" size={"sm"}>
            File System
          </Text>
          <Badge size="sm" variant="light" color="grape">
            {last?.fileSystem}
          </Badge>
        </Group>
      </Stack>
    </Card.Section>
  );
};

const DiskActions: React.FC<{ showDirectory: () => void }> = ({ showDirectory }) => {
  const { classes } = useStyles();

  return (
    <Group mt="xs">
      <Button radius="md" style={{ flex: 1 }}>
        Show details
      </Button>
      <ActionIcon variant="default" radius="md" size={36} onClick={showDirectory}>
        <IconFolderOpen className={classes.folder} stroke={1.5} />
      </ActionIcon>
    </Group>
  );
};

const DiskStatsCard: React.FC<DiskInfoProps> = ({ disk }) => {
  const last = disk.data.at(-1);

  const showDirectory = async () => {
    if (!last?.mountPoint) return;
    await commands.showInFolder(last.mountPoint);
  };

  const range: DynamicProgressRangeInput[] = [
    {
      from: 0,
      to: 50,
      color: "green",
    },
    {
      from: 50,
      to: 80,
      color: "yellow",
    },
    {
      from: 80,
      to: 100,
      color: "red",
    },
  ];

  return (
    <Card shadow="xl" p="sm" radius={"md"} withBorder>
      <DiskTitleImage name={last?.name} />
      <Text size={"sm"}>Free: {formatBytes(last?.free || 0)}</Text>
      <DynamicProgress value={last?.usedPercentage || 0} range={range} />
      <DiskDetails last={last} />
      <DiskActions showDirectory={showDirectory} />
    </Card>
  );
};

export default DiskStatsCard;
