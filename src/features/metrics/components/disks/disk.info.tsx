import DiskAreaChart from "@/features/metrics/components/disks/disk.area-chart";
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Center,
  Group,
  HoverCard,
  Space,
  Stack,
  Image,
  Text,
  createStyles,
  Button,
} from "@mantine/core";
import { Enumerable } from "@/hooks/useServerEventsEnumerableStore";
import { Disk, commands } from "@/lib";
import {
  IconCheck,
  IconDeviceAnalytics,
  IconDeviceFloppy,
  IconFileUnknown,
  IconHeart,
  IconX,
} from "@tabler/icons-react";
import { useEffect } from "react";
import drive from "/drive.png";

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
  card: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.white,
  },

  section: {
    borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },

  like: {
    color: theme.colors.red[6],
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

const DiskStatsCard: React.FC<DiskInfoProps> = ({ disk }) => {
  const { classes } = useStyles();
  const last = disk.data.at(-1);

  const showDirectory = async () => {
    if (!last?.mountPoint) return;
    await commands.showInFolder(last.mountPoint);
  };

  useEffect(() => {}, [disk]);

  return (
    <Card withBorder radius="md" p="md" shadow="xl" className={classes.card}>
      <Card.Section className={classes.section}>
        <Image src={drive} alt="Drive" withPlaceholder />
      </Card.Section>

      <Card.Section className={classes.section}>
        <Group position="apart" align="center">
          <Text fz="lg" fw={500}>
            {last?.name}
          </Text>
          <Badge size="sm" variant="light">
            {last?.diskType}
          </Badge>
        </Group>
        <Text mt="md" className={classes.label} c="dimmed">
          Perfect for you, if you enjoy
        </Text>
      </Card.Section>

      <Group mt="xs">
        <Button radius="md" style={{ flex: 1 }}>
          Show details
        </Button>
        <ActionIcon variant="default" radius="md" size={36}>
          <IconHeart className={classes.like} stroke={1.5} />
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
