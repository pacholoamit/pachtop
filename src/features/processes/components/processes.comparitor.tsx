import * as Highcharts from "highcharts";
import { useEffect } from "react";

import Card from "@/components/card";
import SplineChart, { useSplineChartState } from "@/components/spline-chart";
import formatBytes from "@/features/metrics/utils/format-bytes";
import useComparitorSelector from "@/features/processes/stores/processes-comparator.store";
import useProcessesEnumerableSelectors from "@/features/processes/stores/processes-enumerable.store";
import { Group, MultiSelect, Text } from "@mantine/core";

const ProcessComparitor = () => {
  const processesEnumerable = useProcessesEnumerableSelectors.use.enumerables();
  const comparitorOptions = useComparitorSelector.use.comparitorOptions();
  const comparitorSelected = useComparitorSelector.use.comparitorSelected();
  const setComparitorOptions = useComparitorSelector.use.setComparitorOptions();
  const setComparitorSelected = useComparitorSelector.use.setComparitorSelected();
  const [chartOptions, setChartOptions] = useSplineChartState({
    custom: {
      tooltip: {
        pointFormatter: function () {
          return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formatBytes(
            this.y as number
          )}</b><br/>`;
        },
      },
      yAxis: {
        labels: {
          formatter: (x) => formatBytes(x.value as number),
        },
      },
    },
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

  const handleAddToComparitor = (value: string[]) => setComparitorSelected(value);

  useEffect(() => {
    if (comparitorSelected.length === 0 && processesEnumerable.length > 0) {
      setComparitorSelected([processesEnumerable[0].id]);
    }
    setChartOptions((prev) => ({
      ...prev,
      series: comparitorSelected.map((id) => {
        const process = processesEnumerable.find((proc) => proc.id === id);
        return {
          name: id,
          type: "spline",
          data: process?.data.map((data) => [data.timestamp, data.memoryUsage]) ?? [],
        };
      }),
    }));
    setComparitorOptions(processesEnumerable.map((proc) => proc.id));
  }, [processesEnumerable, setComparitorOptions, comparitorSelected]);

  return (
    <Card>
      <Group position="apart" align="start">
        <Text>Comparitor</Text>
        <MultiSelect
          data={comparitorOptions}
          onChange={handleAddToComparitor}
          value={comparitorSelected}
          searchable
          placeholder="Pick processes"
          maxSelectedValues={3}
          clearable
        />
      </Group>
      <SplineChart options={chartOptions} />
    </Card>
  );
};

export default ProcessComparitor;
