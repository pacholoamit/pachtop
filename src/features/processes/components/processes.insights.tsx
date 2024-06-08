import Highcharts from "highcharts";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import Card from "@/components/card";
import PieChart, { usePieChartState } from "@/components/pie-chart";
import useProcessesEnumerableSelectors from "@/features/processes/stores/processes-enumerable.store";
import { Box, Text } from "@mantine/core";

const ProcessInsightsChart = () => {
  const processesEnumerables = useProcessesEnumerableSelectors(useShallow((state) => state.enumerables));
  const [chartOptions, setChartOptions] = usePieChartState({
    title: {
      text: "",
      floating: true,
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
    // Get the first 5 processes with CPU usage greater than 0
    const sample = processesEnumerables
      .filter((proc) => {
        const data = proc.data[proc.data.length - 1];
        return data.cpuUsage > 0;
      })
      .slice(0, 5);

    setChartOptions((prev) => ({
      ...prev,
      series: [
        {
          name: "CPU Usage",
          type: "pie",
          data: sample.map((proc) => {
            const data = proc.data[proc.data.length - 1];
            return {
              name: data.name,
              y: data.cpuUsage,
            };
          }),
        },
      ],
    }));
  }, [processesEnumerables]);

  return (
    <>
      <PieChart options={chartOptions} />
    </>
  );
};

const ProcessesInsights = () => {
  return (
    <Card>
      <Text>Insights</Text>
      <ProcessInsightsChart />
    </Card>
  );
};

export default ProcessesInsights;
