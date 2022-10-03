import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import SingleBarChart from "@/components/single-bar-chart";
import Card from "@/components/card";
import { ScrollArea } from "@mantine/core";

const CpusBarChart = () => {
  const { cpus } = useMetricsContext();

  const series = cpus.map((cpu) => ({
    name: cpu.name,
    data: [cpu.data.at(-1)?.usage || 0],
  }));

  return (
    <Card>
      <ScrollArea type="scroll">
        {series?.map((s) => (
          <SingleBarChart series={s} key={s.name} />
        ))}
      </ScrollArea>
    </Card>
  );
};

export default CpusBarChart;
