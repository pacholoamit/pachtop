import DiskAreaChart from "@/features/metrics/components/disks/disk.area-chart";
import { ActionIcon, Badge, Box, Card, Center, Group, HoverCard, Space, Stack, Text } from "@mantine/core";
import { Enumerable } from "@/hooks/useServerEventsEnumerableStore";
import { Disk, commands } from "@/lib";
import { IconCheck, IconX } from "@tabler/icons-react";

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
// TODO: Refactor this
const DiskInfo: React.FC<DiskInfoProps> = ({ disk }) => {
  const last = disk.data.at(-1);

  const showDirectory = async () => {
    if (!last?.mountPoint) return;
    await commands.showInFolder(last.mountPoint);
  };

  return (
    <Card shadow="xl" p="sm" radius={"md"} withBorder>
      <Stack spacing="xl">
        <Box style={{ height: "450px" }}>
          <DiskAreaChart disk={disk} />
        </Box>
        <Center>
          <Stack spacing={"xs"}>
            <Group spacing="xs">
              <Text size={"sm"}>Name</Text>
              <Badge color="red">{last?.name}</Badge>
            </Group>
            <Group spacing={"xs"}>
              <Text size={"sm"}>Location</Text>
              <HoverCard>
                <HoverCard.Target>
                  <Badge color="yellow" style={{ cursor: "pointer" }} onClick={showDirectory}>
                    {last?.mountPoint}
                  </Badge>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text size="sm"> Open Folder</Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Group>
          </Stack>
          <Space style={{ width: "120px" }} />
          <Stack spacing={"xs"}>
            <Group spacing={"xs"}>
              <Text size={"sm"}>File System</Text>
              <Badge>{last?.fileSystem}</Badge>
            </Group>
            <Group spacing={"xs"}>
              <Text size={"sm"}>Removable </Text>
              <RemovableIcon isRemovable={last?.isRemovable} />
            </Group>
          </Stack>
        </Center>
      </Stack>
    </Card>
  );
};

export default DiskInfo;
