import Card from "@/components/card";
import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import DiskAreaChart from "@/features/metrics/components/disks/disk.area-chart";
import { Stack } from "@mantine/core";

const xAxisMin = Date.now() - 86400;
const DisksPage = () => {
  const { disks } = useMetricsContext();

  return (
    <Stack spacing="xl">
      <h2>Disks</h2>

      {disks?.map((disk) => (
        <Card style={{ height: "300px" }} key={disk.id}>
          <DiskAreaChart key={disk.id} disk={disk} xAxisMin={xAxisMin} />
        </Card>
      ))}
    </Stack>
  );
};

export default DisksPage;
