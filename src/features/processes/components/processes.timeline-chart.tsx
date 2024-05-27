import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useRef, useState } from "react";

import Card from "@/components/card";
import SplineChart, { useSplineChartState } from "@/components/spline-chart";
import useProcessesEnumerableSelectors from "@/features/processes/stores/processes-enumerable.store";
import { Text } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

import formatBytes from "../../metrics/utils/format-bytes";

const ProcessTimelineChart = () => {
  // Chart Options: Control & configure the chart
  const processesEnumerable = useProcessesEnumerableSelectors.use.enumerables();
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [chartOptions, setChartOptions] = useSplineChartState({
    custom: {
      yAxis: {
        labels: {
          formatter: (x) => {
            return formatBytes(x.value as number);
          },
        },
      },
    },
    title: {
      text: "Process Timeline",
      style: {
        fontFamily: "Geist Variable, Roboto, Arial, sans-serif",
        fontWeight: "bold",
        fontSize: "16px",
        color: "#dce1e8",
      },
    },

    xAxis: {
      labels: {
        formatter: function () {
          return Highcharts.dateFormat("%H:%M:%S", this.value as number);
        },
      },
    },
  });

  useEffect(() => {
    setChartOptions((prev) => ({
      ...prev,
      series: [
        {
          name: processesEnumerable[0].id,
          type: "spline",
          data: processesEnumerable[0].data.map((data) => [data.timestamp, data.memoryUsage]),
        },
      ],
    }));
  }, [processesEnumerable]);

  return (
    <Card>
      <Text>Timeline Chart</Text>
      <SplineChart options={chartOptions} />;
    </Card>
  );
};

export default ProcessTimelineChart;
