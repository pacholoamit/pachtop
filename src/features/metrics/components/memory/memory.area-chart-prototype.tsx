import Card from "@/components/card";
import formatBytes from "@/features/metrics/utils/format-bytes";
import AreaChart from "@/components/area-chart.prototype";
import useServerEventsContext from "@/hooks/useServerEventsContext";
import * as Highcharts from "highcharts";
import { useEffect, useState } from "react";
import * as luxon from "luxon";

const time = new Highcharts.Time();

// TODO: Remove Luxon and ChartJS
// TODO: Make timestamp work automatically
// TODO: fix time
const MemoryAreaChart: React.FC = ({}) => {
  const { memory } = useServerEventsContext();
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    title: {
      text: "Random Access Memory (RAM)",
      style: {
        fontFamily: "Roboto, Arial, sans-serif",
        fontWeight: "bold",
        fontSize: "18px",
        color: "#dce1e8",
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },
    colors: [
      {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, "rgba(10, 167, 147, 1)"],
          [1, "rgba(10, 167, 147, 0.45)"],
        ],
      },
    ],

    xAxis: {
      type: "datetime",
      gridLineColor: "#263858",
      lineColor: "#263858",

      labels: {
        format: "{value:%I:%M %p}",
        style: {
          color: "#8192ac",
        },
      },
    },
    legend: {
      enabled: false,
    },

    yAxis: {
      title: {
        text: null,
      },
      gridLineColor: "#263858",
      lineColor: "#263858",
      labels: {
        formatter: (x) => formatBytes(x.value as number),
        style: {
          color: "#8192ac",
        },
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      xDateFormat: "%I:%M:%S %p",
      pointFormatter: function () {
        return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formatBytes(
          this.y as number
        )}</b><br/>`;
      },
    },
    chart: {
      backgroundColor: "transparent",
      style: {
        color: "#dce1e8",
      },
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
    <Card style={{ height: "300px" }}>
      <AreaChart options={chartOptions} />
    </Card>
  );
};

export default MemoryAreaChart;
