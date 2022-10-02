import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import GradientRadialChart from "@/components/gradient-radial-chart";

const MemoryRadialChart = () => {
  const { memory } = useMetricsContext();

  const series: ApexAxisChartSeries | ApexNonAxisChartSeries = [
    memory?.at(-1)?.usedPercentage || 0,
  ];
  return <GradientRadialChart labels={["RAM Usage"]} series={series} />;
};

export default MemoryRadialChart;
