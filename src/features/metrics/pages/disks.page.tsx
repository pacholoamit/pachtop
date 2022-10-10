import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import formatBytes from "@/features/metrics/utils/format-bytes";
import { useEffect } from "react";
import AreaChart, { DatasetOptions } from "@/components/area-chart";

const DisksPage = () => {
  const { disks } = useMetricsContext();

  return (
    <>
      <h1>Disks</h1>
      {disks?.map((disk) => {
        const labels = disk.data.map((data) => data.timestamp);
        const datasets: DatasetOptions[] = [
          {
            label: disk.name,
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
          <AreaChart
            labels={labels}
            title={disk.name}
            key={disk.name}
            datasets={datasets}
            callbacks={callbacks}
            yAxisTicksCallback={yAxisTicksCallback}
          />
        );
      })}
    </>
  );
};

export default DisksPage;
