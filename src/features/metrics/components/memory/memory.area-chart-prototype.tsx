import Card from "@/components/card";
import formatBytes from "@/features/metrics/utils/format-bytes";
import AreaChart from "@/components/are-chart.prototype";
import useServerEventsContext from "@/hooks/useServerEventsContext";
import * as Highcharts from "highcharts";
import { memo, useEffect, useState } from "react";

const MemoryAreaChart: React.FC = ({}) => {
  const { memory } = useServerEventsContext();
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    title: {
      text: "Random Access Memory (RAM)",
    },
    credits: {
      enabled: false,
    },
    rangeSelector: {
      buttons: [
        {
          count: 1,
          type: "minute",
          text: "1M",
        },
        {
          count: 5,
          type: "minute",
          text: "5M",
        },
        {
          type: "all",
          text: "All",
        },
      ],
      selected: 1,
    },
  });

  useEffect(() => {
    setChartOptions((prevOptions) => {
      return {
        ...prevOptions,
        series: [
          {
            name: "RAM Usage",
            type: "area",
            data: memory.map((mem) => [mem.timestamp, mem.used]),
          },
        ],
      };
    });
  }, [memory]);

  return (
    <Card style={{ height: "500px" }}>
      <AreaChart options={chartOptions} />
    </Card>
  );
};

export default MemoryAreaChart;
