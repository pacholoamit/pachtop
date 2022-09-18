import useGetMetrics from "@/hooks/useGetMetrics";
import AreaChart, {
  AreaChartProps,
  DatasetOptions,
} from "@/components/area-chart";

import { Title } from "@mantine/core";

const HomePage = () => {
  const { memory } = useGetMetrics();
  const unit = memory.slice(-1)[0]?.unit;

  const datasets: DatasetOptions[] = [
    {
      label: `Ram Total ${unit}`,
      data: memory.map((mem) => mem.total),
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      fill: true,
      yAxisId: "ram-total",
    },
    {
      label: `Ram Used ${unit}`,
      data: memory.map((mem) => mem.used),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      borderColor: "rgba(53, 162, 235)",
      fill: true,
      yAxisId: "ram-used",
    },
  ];

  return (
    <>
      <Title>RAM chart</Title>

      <AreaChart
        labels={memory.map((mem) => mem.timestamp)}
        datasets={datasets}
      />
    </>
  );
};

export default HomePage;
