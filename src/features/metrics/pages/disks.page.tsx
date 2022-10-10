import Card from "@/components/card";
import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import formatBytes from "@/features/metrics/utils/format-bytes";
import AreaChart, { DatasetOptions } from "@/components/area-chart";
import { Stack } from "@mantine/core";

const DisksPage = () => {
  const { disks } = useMetricsContext();

  return (
    <Stack spacing="xl">
      <h2>Disks</h2>
      {disks?.map((disk) => {
        const labels = disk.data.map((data) => data.timestamp);
        const datasets: DatasetOptions[] = [
          {
            label: disk.id,
            data: disk.data.map((data) => ({
              x: data.timestamp,
              y: data.used,
            })),
            backgroundColor: "rgba(255,215,120,0.4)",
            borderColor: "rgba(255,215,120,1)",
            fill: true,
            yAxisId: "disk-used",
          },
        ];
        const callbacks = {
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = formatBytes(context.parsed.y);
            return `${label}: ${value}`;
          },
        };
        const yAxisTicksCallback = (value: number) => formatBytes(value);
        return (
          <Card style={{ height: "300px" }} key={disk.id}>
            <AreaChart
              labels={labels}
              title={disk.id}
              datasets={datasets}
              callbacks={callbacks}
              yAxisTicksCallback={yAxisTicksCallback}
            />
          </Card>
        );
      })}
    </Stack>
  );
};

export default DisksPage;
