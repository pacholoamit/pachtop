import Card from "@/components/card";
import formatBytes from "@/features/metrics/utils/format-bytes";
import AreaChart, { useAreaChartState } from "@/components/area-chart";
import useServerEventsContext from "@/hooks/useServerEventsContext";
import { useEffect, useState } from "react";
import { SeriesOptionsType } from "highcharts";

// TODO: Remove Luxon and ChartJS
// TODO: Make timestamp work automatically
// TODO: fix time

const NetworksAreaChart: React.FC = ({}) => {
  const { networks } = useServerEventsContext();
  const [chartOptions, setChartOptions] = useAreaChartState({
    title: {
      text: "Network Received",
    },
    yAxis: {
      labels: {
        formatter: (x) => formatBytes(x.value as number),
      },
    },
    series: networks.map((network) => ({
      name: `${network.id}`,
      type: "area",
      data: network.data.map((net) => [net.timestamp, net.received]),
    })),
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
      series: networks.map((network) => ({
        name: `${network.id}`,
        type: "area",
        data: network.data.map((net) => [net.timestamp, net.received]),
      })),
    });
  }, [JSON.stringify(networks)]);

  console.log("render");

  return (
    <Card style={{ height: "450px" }}>
      <AreaChart options={chartOptions} />
    </Card>
  );
};

export default NetworksAreaChart;
