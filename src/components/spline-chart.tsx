import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import formatBytes from "@/features/metrics/utils/format-bytes";
import { Text, useMantineTheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

export interface InitialSplineChartStateInput extends Partial<Highcharts.Options> {
  custom: {
    // series?: Highcharts.SeriesOptionsType[];
    yAxis: {
      labels: {
        formatter: Highcharts.AxisLabelsFormatterCallbackFunction;
      };
    };
    // tooltip: {
    //   pointFormatter: Highcharts.FormatterCallbackFunction<Highcharts.Point>;
    // };
  };
}

export const useSplineChartState = (
  props: InitialSplineChartStateInput
): [Highcharts.Options, Dispatch<SetStateAction<Highcharts.Options>>] => {
  const { other } = useMantineTheme();

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    ...props,
    chart: {
      type: "spline",
      backgroundColor: "transparent",
      style: {
        fontFamily: "Geist Variable, Roboto, Arial, sans-serif",
      },
    },

    xAxis: {
      type: "datetime",
      gridLineColor: other.charts.area.default.gridLineColor,
      lineColor: other.charts.area.default.lineColor,
      labels: {
        // enabled: false,
        step: 2,
        format: "{value:%I:%M:%S %p}",
        style: {
          color: other.charts.area.default.labelColor,
        },
      },
    },
    time: {
      useUTC: false,
    },
    yAxis: {
      title: {
        text: null,
      },
      startOnTick: true,
      gridLineColor: other.charts.area.default.gridLineColor,
      lineColor: other.charts.area.default.lineColor,
      labels: {
        formatter: props.custom.yAxis.labels.formatter,
        style: {
          color: "white",
        },
      },
    },
    tooltip: {
      xDateFormat: "%H:%M:%S",
      style: {
        color: other.charts.area.default.tooltip.color,
      },
      backgroundColor: other.charts.area.default.tooltip.backgroundColor,
    },
    credits: {
      enabled: false,
    },
    boost: {
      enabled: true,
      useGPUTranslations: false,
      allowForce: true,
    },
  });

  return [chartOptions, setChartOptions];
};

const SplineChart: React.FC<HighchartsReact.Props> = (props) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  const { width } = useViewportSize();

  useEffect(() => {
    chartComponentRef.current?.chart?.reflow();
  }, [width]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={props.options}
      ref={chartComponentRef}
      containerProps={{ style: { height: "100%", width: "100%" } }}
    />
  );
};

export default SplineChart;
