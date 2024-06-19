import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import useSettings from "@/hooks/useSettings";
import { useMantineTheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

export interface SplineChartStatePropsInitialState extends Highcharts.Options {
  custom?: {
    yAxis?: {
      labels: {
        formatter: Highcharts.AxisLabelsFormatterCallbackFunction | undefined;
      };
    };
    tooltip?: {
      pointFormatter: Highcharts.FormatterCallbackFunction<Highcharts.Point> | undefined;
    };
  };
}

export const useSplineChartState = (
  props: SplineChartStatePropsInitialState
): [SplineChartStatePropsInitialState, Dispatch<SetStateAction<SplineChartStatePropsInitialState>>] => {
  const { other } = useMantineTheme();
  const { isPerformanceModeEnabled } = useSettings();
  const [chartOptions, setChartOptions] = useState<SplineChartStatePropsInitialState>({
    ...props,
    chart: {
      type: "spline",
      backgroundColor: "transparent",
      animation: isPerformanceModeEnabled ? false : true,
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
        // TODO: Set this to SPline chart color
        style: {
          color: other.charts.area.default.labelColor,
        },
      },
    },
    plotOptions: {
      series: {
        animation: {
          duration: isPerformanceModeEnabled ? 0 : 1000,
        },
      },
    },

    legend: {
      backgroundColor: "transparent",
      itemStyle: {
        // TODO: Set this to SPline chart color
        color: other.charts.area.default.legend.color,
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
        formatter: props?.custom?.yAxis?.labels?.formatter,
        style: {
          color: "white",
        },
      },
    },
    tooltip: {
      xDateFormat: "%I:%M:%S %p",
      pointFormatter: props?.custom?.tooltip?.pointFormatter,
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
      containerProps={{ style: { height: "92%", width: "100%" } }}
    />
  );
};

export default SplineChart;
