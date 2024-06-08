import * as Highcharts from 'highcharts';
import { useEffect, useMemo, useState } from 'react';

import Card from '@/components/card';
import SplineChart, { useSplineChartState } from '@/components/spline-chart';
import formatBytes from '@/features/metrics/utils/format-bytes';
import fromNumberToPercentageString from '@/features/metrics/utils/from-number-to-percentage-string';
import useComparatorSelector from '@/features/processes/stores/processes-comparator.store';
import useProcessesEnumerableSelectors from '@/features/processes/stores/processes-enumerable.store';
import { Process } from '@/lib';
import { Group, MultiSelect, SegmentedControl, Text } from '@mantine/core';

type ComparatorMetric = keyof Process;

interface ComparatorMetricOption {
  label: string;
  value: ComparatorMetric;
  yAxisFormatter: Highcharts.AxisLabelsFormatterCallbackFunction;
  tooltipFormatter: Highcharts.FormatterCallbackFunction<Highcharts.Point>;
}

const metricOptions: ComparatorMetricOption[] = [
  {
    label: "MEM",
    value: "memoryUsage",
    yAxisFormatter: (x) => formatBytes(x.value as unknown as number),
    tooltipFormatter: function () {
      return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formatBytes(
        this.y as number
      )}</b><br/>`;
    },
  },
  {
    label: "CPU",
    value: "cpuUsage",
    yAxisFormatter: (x) => fromNumberToPercentageString(x.value as number),
    tooltipFormatter: function () {
      return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${fromNumberToPercentageString(
        this.y as number
      )}</b><br/>`;
    },
  },
];

const ProcessComparator = () => {
  const processesEnumerable = useProcessesEnumerableSelectors.use.enumerables();
  const comparatorOptions = useComparatorSelector.use.comparatorOptions();
  const comparatorSelected = useComparatorSelector.use.comparatorSelected();
  const setComparatorOptions = useComparatorSelector.use.setComparatorOptions();
  const setComparatorSelected = useComparatorSelector.use.setComparatorSelected();
  const [comparatorMetric, setComparatorMetric] = useState<ComparatorMetricOption>(metricOptions[0]);

  const [chartOptions, setChartOptions] = useSplineChartState({
    custom: {
      tooltip: {
        pointFormatter: comparatorMetric.tooltipFormatter,
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

  const handleAddToComparator = (value: string[]) => setComparatorSelected(value);
  const handleSetMetric = (value: string) => setComparatorMetric(metricOptions.find((opt) => opt.value === value)!);

  useEffect(() => {
    setComparatorOptions(processesEnumerable.map((proc) => proc.id));

    const isProcessesOptionsNotEmpty = processesEnumerable.length > 0;
    const isNoProcessSelectedInComparator = comparatorSelected.length === 0;
    //* Get the first process in the list if no process is selected

    if (isNoProcessSelectedInComparator && isProcessesOptionsNotEmpty) {
      setComparatorSelected([processesEnumerable[0].id]);
    }
  }, [processesEnumerable, setComparatorOptions, comparatorSelected, setComparatorSelected]);

  useEffect(() => {
    setChartOptions((prev) => ({
      tooltip: {
        pointFormatter: comparatorMetric.tooltipFormatter,
      },
      yAxis: {
        labels: {
          formatter: comparatorMetric.yAxisFormatter,
        },
      },

      series: comparatorSelected.map((id) => {
        const process = processesEnumerable.find((proc) => proc.id === id);

        return {
          name: id,
          type: "spline",
          data: process?.data.map((data) => [data.timestamp, data[comparatorMetric.value]]) ?? [],
        };
      }),
    }));
  }, [comparatorSelected, comparatorMetric, setChartOptions, processesEnumerable]);

  const memoizedSegmentedControlData = useMemo(
    () =>
      metricOptions.map((opt) => ({
        value: opt.value,
        label: opt.label,
        // disabled: opt.value === "cpuUsage" && true,
      })),
    []
  );

  const memoizedMultiSelectData = useMemo(() => comparatorOptions, [comparatorOptions]);

  return (
    <Card>
      <Group position="apart" align="start">
        <Text>Metrics Comparator</Text>
        <Group>
          <SegmentedControl
            defaultValue={comparatorMetric.value}
            data={memoizedSegmentedControlData}
            onChange={handleSetMetric}
            size="xs"
          />
          <MultiSelect
            data={memoizedMultiSelectData}
            onChange={handleAddToComparator}
            value={comparatorSelected}
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

export default ProcessComparator;
