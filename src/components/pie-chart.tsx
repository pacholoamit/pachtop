import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { useMantineTheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

export interface PieChartStatePropsInitialState extends Highcharts.Options {
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

export const usePieChartState = (
  props: PieChartStatePropsInitialState
): [PieChartStatePropsInitialState, Dispatch<SetStateAction<PieChartStatePropsInitialState>>] => {
  const { other } = useMantineTheme();

  const [chartOptions, setChartOptions] = useState<PieChartStatePropsInitialState>({
    ...props,
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      style: {
        fontFamily: "Geist Variable, Roboto, Arial, sans-serif",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: false,
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

const PieChart: React.FC<HighchartsReact.Props> = (props) => {
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

export default PieChart;
