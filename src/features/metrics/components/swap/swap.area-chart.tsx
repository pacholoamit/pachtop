import Card from "@/components/card";
import formatBytes from "@/features/metrics/utils/format-bytes";
import AreaChart, { useAreaChartState } from "@/components/area-chart.prototype";
import useServerEventsContext from "@/hooks/useServerEventsContext";
import { useEffect } from "react";

// backgroundColor: "rgba(53, 162, 235, 0.45)",
//     borderColor: "rgba(53, 162, 235)",

const SwapAreaChart: React.FC = ({}) => {
  const { swap } = useServerEventsContext();
  const [chartOptions, setChartOptions] = useAreaChartState({
    title: {
      text: "Swap Memory Usage",
    },
    yAxis: {
      labels: {
        formatter: (x) => formatBytes(x.value as number),
      },
    },
    tooltip: {
      pointFormatter: function () {
        return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formatBytes(
          this.y as number
        )}</b><br/>`;
      },
    },
  });

  useEffect(() => {
    setChartOptions({
      series: [
        {
          name: "Swap Usage",
          type: "area",
          data: swap.map((mem) => [mem.timestamp, mem.used]),
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, "rgba(53, 162, 235, 0.45)"],
              [1, "rgba(53, 162, 235)"],
            ],
          },
        },
      ],
    });
  }, [swap]);

  return (
    <Card style={{ height: "450px" }}>
      <AreaChart options={chartOptions} />
    </Card>
  );
};

export default SwapAreaChart;
