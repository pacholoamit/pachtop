import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import DiskAreaChart from "@/features/metrics/components/disks/disk.area-chart";
import PageWrapper from "@/components/page-wrapper";
import { Box, Card, Center, Space, Stack, Text } from "@mantine/core";

const xAxisMin = Date.now() - 86400;

const DisksPage = () => {
  const { disks } = useMetricsContext();

  return (
    <PageWrapper name="Disks">
      {disks?.map((disk) => {
        return (
          <Card key={disk.id} shadow="xl" p="sm" radius={"md"} withBorder>
            <Stack spacing="xl">
              <Box style={{ height: "300px" }}>
                <DiskAreaChart key={disk.id} disk={disk} xAxisMin={xAxisMin} />
              </Box>
              <Center>
                <Stack spacing={"xs"}>
                  <Text>Name: {disk.data.at(-1)?.name}</Text>
                  <Text>Mount Point: {disk.data.at(-1)?.mountPoint}</Text>
                </Stack>
                <Space style={{ width: "120px" }} />
                <Stack spacing={"xs"}>
                  <Text>File System: {disk.data.at(-1)?.fileSystem}</Text>
                  <Text>
                    Removable: {disk.data.at(-1)?.isRemovable.toString()}
                  </Text>
                </Stack>
              </Center>
            </Stack>
          </Card>
        );
      })}
    </PageWrapper>
  );
};

export default DisksPage;
