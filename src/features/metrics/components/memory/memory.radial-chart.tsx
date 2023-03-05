import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import GradientRadialChart from "@/components/gradient-radial-chart";
import useServerEventsContext from "../../../../hooks/useServerEventsContext";

const MemoryRadialChart = () => {
  const { memory } = useServerEventsContext();

  const series = [memory?.at(-1)?.usedPercentage || 0];
  return <GradientRadialChart labels={["RAM Usage"]} series={series} />;
};

export default MemoryRadialChart;
