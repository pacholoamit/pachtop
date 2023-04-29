import GradientRadialChart from "@/components/gradient-radial-chart";
import useServerEventsContext from "@/hooks/useServerEventsContext";

const SwapRadialChart = () => {
  const { swap } = useServerEventsContext();

  const series = [swap?.at(-1)?.usedPercentage || 0];
  return <GradientRadialChart labels={["Swap Usage"]} series={series} />;
};

export default SwapRadialChart;
