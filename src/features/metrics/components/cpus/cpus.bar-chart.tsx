import useServerEventsContext from "@/hooks/useServerEventsContext";
import SingleBarChart from "@/components/single-bar-chart";
import Card from "@/components/card";

const CpusBarChart = () => {
  const { cpus } = useServerEventsContext();

  const series = cpus.map((cpu) => ({
    name: cpu.id,
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
