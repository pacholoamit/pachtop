import DiskAreaChart from "@/features/metrics/components/disks/disk.area-chart";
import { ActionIcon, Badge, Box, Card, Center, Group, Space, Stack, Text } from "@mantine/core";
import { Enumerable } from "@/hooks/useServerEventsEnumerableStore";
import { Disk } from "@/lib/types";
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
const DiskInfo: React.FC<DiskInfoProps> = ({ disk }) => {
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
              <Badge color="red">{disk.data.at(-1)?.name}</Badge>
            </Group>
            <Group spacing={"xs"}>
              <Text size={"sm"}>Mount Point </Text>
              <Badge color="yellow">{disk.data.at(-1)?.mountPoint}</Badge>
            </Group>
          </Stack>
          <Space style={{ width: "120px" }} />
          <Stack spacing={"xs"}>
            <Group spacing={"xs"}>
              <Text size={"sm"}>File System</Text>
              <Badge>{disk.data.at(-1)?.fileSystem}</Badge>
            </Group>
            <Group spacing={"xs"}>
              <Text size={"sm"}>Removable </Text>
              <RemovableIcon isRemovable={disk.data.at(-1)?.isRemovable} />
            </Group>
          </Stack>
        </Center>
      </Stack>
    </Card>
  );
};

export default DiskInfo;
