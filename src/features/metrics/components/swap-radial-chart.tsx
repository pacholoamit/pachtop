import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import GradientRadialChart from "@/components/gradient-radial-chart";

const SwapRadialChart = () => {
  const { swap } = useMetricsContext();

  const series: ApexAxisChartSeries | ApexNonAxisChartSeries = [
    swap?.at(-1)?.usedPercentage || 0,
  ];
  return <GradientRadialChart labels={["Swap Usage"]} series={series} />;
};

export default SwapRadialChart;
