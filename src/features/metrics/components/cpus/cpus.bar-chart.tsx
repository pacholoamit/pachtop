import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import SingleBarChart from "@/components/single-bar-chart";
import Card from "@/components/card";

const CpusBarChart = () => {
  const { cpus } = useMetricsContext();

  const series = cpus.map((cpu) => ({
    name: cpu.name,
    data: [cpu.data.at(-1)?.usage || 0],
  }));

  return (
    <Card style={{ width: "100%", overflowY: "scroll" }}>
      {series?.map((s) => (
        <SingleBarChart series={s} key={s.name} />
      ))}
    </Card>
  );
};

export default CpusBarChart;
