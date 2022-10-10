import { ChartProps } from "@/features/metrics/utils/types";
import AreaChart, { DatasetOptions } from "@/components/area-chart";
import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";

interface DisksAreaChartProps extends ChartProps {}

const DisksAreaChart: React.FC<DisksAreaChartProps> = ({ xAxisMin }) => {
  const { disks } = useMetricsContext();
  return null;
};

export default DisksAreaChart;
