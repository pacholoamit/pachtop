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
  Progress,
  DefaultMantineColor,
  Center,
  Title,
} from "@mantine/core";
import { Enumerable } from "@/hooks/useServerEventsEnumerableStore";
import { Disk, commands } from "@/lib";
import { IconCheck, IconFolderOpen, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import drive from "/drive.png";
import formatBytes from "@/features/metrics/utils/format-bytes";

interface RemovableIconProps {
  isRemovable?: boolean;
}

const RemovableIcon: React.FC<RemovableIconProps> = (props) => {
  return props.isRemovable ? (
    <ActionIcon variant="transparent" color="green">
      <IconCheck size={"1rem"} />
    </ActionIcon>
  ) : (
    <ActionIcon variant="transparent" color="red">
      <IconX size={"1rem"} />
    </ActionIcon>
  );
};
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

const onCheckDisk = async (mountPoint: string) => {
  console.log("Checking disk", mountPoint);
  await commands.deepScan({ path: mountPoint }).then((res) => {
    console.log(res);
  });
};

interface DynamicProgressRangeInput {
  from: number;
  to: number;
  color: DefaultMantineColor;
}
interface DynamicProgressProps {
  value: number;
  range?: DynamicProgressRangeInput[];
}

const DynamicProgress: React.FC<DynamicProgressProps> = (props) => {
  const { value, range } = props;
  const [color, setColor] = useState("blue");

  useEffect(() => {
    if (!range) return;
    const currentColor = range.find((r) => value >= r.from && value <= r.to)?.color;
    if (currentColor) setColor(currentColor);
  }, [value, range]);

  return <Progress value={value} color={color} size={"xs"} />;
};

const DiskStatsCard: React.FC<DiskInfoProps> = ({ disk }) => {
  const { classes } = useStyles();
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
      <Card.Section className={classes.section}>
        <Center>
          <Title order={6}>{last?.name}</Title>
        </Center>
        <Image src={drive} alt="Drive" withPlaceholder />

        <Text size={"sm"}>Free: {formatBytes(last?.free || 0)}</Text>

        <DynamicProgress value={last?.usedPercentage || 0} range={range} />
      </Card.Section>

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

      <Group mt="xs">
        <Button radius="md" style={{ flex: 1 }}>
          Show details
        </Button>
        <ActionIcon variant="default" radius="md" size={36} onClick={showDirectory}>
          <IconFolderOpen className={classes.folder} stroke={1.5} />
        </ActionIcon>
      </Group>
    </Card>
  );
};

// TODO: Refactor this
// const DiskInfo: React.FC<DiskInfoProps> = ({ disk }) => {
//   const last = disk.data.at(-1);

//   const showDirectory = async () => {
//     if (!last?.mountPoint) return;
//     await commands.showInFolder(last.mountPoint);
//   };

//   return (
//     <Card shadow="xl" p="sm" radius={"md"} withBorder>
//       <Stack spacing="xl">
//         <Box style={{ height: "450px" }}>
//           <DiskAreaChart disk={disk} />
//         </Box>
//         <Center>
//           <Stack spacing={"xs"}>
//             <Group spacing="xs">
//               <Text size={"sm"}>Name</Text>
//               <Badge color="red">{last?.name}</Badge>
//             </Group>
//             <Group spacing={"xs"}>
//               <Text size={"sm"}>Location</Text>
//               <HoverCard>
//                 <HoverCard.Target>
//                   <Badge color="yellow" style={{ cursor: "pointer" }} onClick={showDirectory}>
//                     {last?.mountPoint}
//                   </Badge>
//                 </HoverCard.Target>
//                 <HoverCard.Dropdown>
//                   <Text size="sm"> Open Folder</Text>
//                 </HoverCard.Dropdown>
//               </HoverCard>
//             </Group>
//           </Stack>
//           <Space style={{ width: "120px" }} />
//           <Stack spacing={"xs"}>
//             <Group spacing={"xs"}>
//               <Text size={"sm"}>File System</Text>
//               <Badge>{last?.fileSystem}</Badge>
//             </Group>
//             <Group spacing={"xs"}>
//               <Text size={"sm"}>Removable </Text>
//               <RemovableIcon isRemovable={last?.isRemovable} />
//             </Group>
//           </Stack>
//         </Center>
//       </Stack>
//     </Card>
//   );
// };

export default DiskStatsCard;
