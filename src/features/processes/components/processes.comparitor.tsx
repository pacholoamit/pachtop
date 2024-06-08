import * as Highcharts from 'highcharts';
import { useEffect, useMemo, useState } from 'react';

import Card from '@/components/card';
import SplineChart, { useSplineChartState } from '@/components/spline-chart';
import formatBytes from '@/features/metrics/utils/format-bytes';
import fromNumberToPercentageString from '@/features/metrics/utils/from-number-to-percentage-string';
import useComparitorSelector from '@/features/processes/stores/processes-comparator.store';
import useProcessesEnumerableSelectors from '@/features/processes/stores/processes-enumerable.store';
import { Process } from '@/lib';
import { Group, MultiSelect, SegmentedControl, Space, Stack, Text } from '@mantine/core';

type ComparitorMetric = keyof Process;

interface ComparitorMetricOption {
  label: string;
  value: ComparitorMetric;
  yAxisFormatter: Highcharts.AxisLabelsFormatterCallbackFunction;
  tooltipFormatter: Highcharts.FormatterCallbackFunction<Highcharts.Point>;
}

const metricOptions: ComparitorMetricOption[] = [
  {
    label: "MEM",
    value: "memoryUsage",
    yAxisFormatter: (x) => formatBytes(x as unknown as number),
    tooltipFormatter: function () {
      return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formatBytes(
        this.y as number
      )}</b><br/>`;
    },
  },
  {
    label: "CPU",
    value: "cpuUsage",
    yAxisFormatter: (x) => fromNumberToPercentageString(x as unknown as number),
    tooltipFormatter: function () {
      return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${fromNumberToPercentageString(
        this.y as number
      )}</b><br/>`;
    },
  },
];

const ProcessComparitor = () => {
  const processesEnumerable = useProcessesEnumerableSelectors.use.enumerables();
  const comparitorOptions = useComparitorSelector.use.comparitorOptions();
  const comparitorSelected = useComparitorSelector.use.comparitorSelected();
  const setComparitorOptions = useComparitorSelector.use.setComparitorOptions();
  const setComparitorSelected = useComparitorSelector.use.setComparitorSelected();
  const [comparitorMetric, setComparitorMetric] = useState<ComparitorMetricOption>(metricOptions[0]);

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
  const handleSetMetric = (value: string) => setComparitorMetric(metricOptions.find((opt) => opt.value === value)!);

  useEffect(() => {
    if (comparitorSelected.length === 0 && processesEnumerable.length > 0) {
      setComparitorSelected([processesEnumerable[0].id]);
    }
    setComparitorOptions(processesEnumerable.map((proc) => proc.id));
  }, [processesEnumerable, setComparitorOptions, comparitorSelected, setComparitorSelected]);

  useEffect(() => {
    setChartOptions((prev) => ({
      ...prev,
      custom: {
        tooltip: {
          pointFormatter: comparitorMetric.tooltipFormatter,
        },
        yAxis: {
          labels: {
            formatter: comparitorMetric.yAxisFormatter,
          },
        },
      },
      series: comparitorSelected.map((id) => {
        const process = processesEnumerable.find((proc) => proc.id === id);
        return {
          name: id,
          type: "spline",
          data: process?.data.map((data) => [data.timestamp, data[comparitorMetric.value]]) ?? [],
        };
      }),
    }));
  }, [comparitorSelected, comparitorMetric, setChartOptions, processesEnumerable]);

  const memoizedSegmentedControlData = useMemo(
    () =>
      metricOptions.map((opt) => ({
        value: opt.value,
        label: opt.label,
        disabled: opt.value === "cpuUsage" && true,
      })),
    []
  );

  const memoizedMultiSelectData = useMemo(() => comparitorOptions, [comparitorOptions]);

  return (
    <Card>
      <Group position="apart" align="start">
        <Text>Metrics Comparitor</Text>
        <Group>
          <SegmentedControl
            defaultValue={comparitorMetric.value}
            data={memoizedSegmentedControlData}
            onChange={handleSetMetric}
            size="xs"
          />
          <MultiSelect
            data={memoizedMultiSelectData}
            onChange={handleAddToComparitor}
            value={comparitorSelected}
            searchable
            placeholder="Pick processes"
            maxSelectedValues={4}
          />
        </Group>
      </Group>
      <SplineChart options={chartOptions} />
    </Card>
  );
};

export default ProcessComparitor;
