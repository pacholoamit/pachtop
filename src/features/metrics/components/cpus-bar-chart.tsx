import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import BarChart from "@/components/bar-chart";

import { useEffect } from "react";

const CpusRadialChart = () => {
  const { cpus } = useMetricsContext();

  const series = cpus.map((cpu) => ({
    name: cpu.name,
    data: [cpu.data.at(-1)?.usage || 0],
  }));

  useEffect(() => console.log(series), [series]);
  return <BarChart />;
};

export default CpusRadialChart;
