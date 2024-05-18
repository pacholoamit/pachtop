import Card from "@/components/card";
import formatBytes from "@/features/metrics/utils/format-bytes";
import AreaChart, { useAreaChartState } from "@/components/area-chart";
import useServerEventsContext from "@/hooks/useServerEventsContext";
import { useEffect } from "react";

import { useMantineTheme } from "@mantine/core";

const NetworksReceivedAreaChart: React.FC = ({}) => {
  const { networks } = useServerEventsContext();
  const { other } = useMantineTheme();
  const [chartOptions, setChartOptions] = useAreaChartState({
    title: {
      text: "Network Activity (Received)",
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
        color: other.charts.area.networkReceived.color,
      })),
    });
  }, [JSON.stringify(networks)]);

  return (
    <Card style={{ height: "410px" }}>
      <AreaChart options={chartOptions} />
    </Card>
  );
};

export default NetworksReceivedAreaChart;
