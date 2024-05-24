import { useEffect } from "react";

import AreaChart, { useAreaChartState } from "@/components/area-chart";
import Card from "@/components/card";
import useNetworkSelectors from "@/features/metrics/stores/networks.store";
import formatBytes from "@/features/metrics/utils/format-bytes";
import { useMantineTheme } from "@mantine/core";

// TODO: Fix typescript
const NetworksReceivedAreaChart: React.FC = ({}) => {
  const networks = useNetworkSelectors.use.enumerables();
  const { other } = useMantineTheme();

  console.log(networks);
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
