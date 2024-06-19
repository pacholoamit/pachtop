import { useEffect } from "react";

import BarChart, { useBarChartState } from "@/components/bar-chart";
import Card from "@/components/card";
import useCpusSelectors from "@/features/metrics/stores/cpus.store";
import fromNumberToPercentageString from "@/features/metrics/utils/from-number-to-percentage-string";
import { Space, useMantineTheme } from "@mantine/core";

const CpusBarChart: React.FC = () => {
  const { other } = useMantineTheme();
  const [chartOptions, setChartOptions] = useBarChartState({
    custom: {
      title: "CPU Threads",
      yAxisMax: 100,
      yaAxisFormatter: (x) => `${fromNumberToPercentageString(x.value as number)}`,
      tooltipPointFomatter: function () {
        return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${fromNumberToPercentageString(
          this.y || 0
        )}</b><br/>`;
      },
      plotOptionsColumn: {
        borderColor: "transparent",
        color: {
          stops: [
            [0, "rgba(236, 18, 120,0.75)"],
            [1, "rgba(236, 18, 120, 0)"],
          ],
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        },
      },
    },

    xAxis: {
      crosshair: true,
    },
  });
  const cpus = useCpusSelectors.use.cpus();

  useEffect(() => {
    setChartOptions((prev) => ({
      ...prev,
      xAxis: {
        categories: cpus.map((cpu) => cpu.name),
      },
      series: [
        {
          name: "Usage",
          type: "column",
          data: cpus.map((cpu) => cpu.usage),
        },
      ],
    }));
  }, [cpus]);
  return (
    <Card style={{ height: "380px" }}>
      <BarChart options={chartOptions} />
    </Card>
  );
};
export default CpusBarChart;
