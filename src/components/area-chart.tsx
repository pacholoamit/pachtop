import HighchartsReact from "highcharts-react-official";
import * as Highcharts from "highcharts/highstock";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { useMantineTheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

export interface InitialAreaChartStateInput {
  title: {
    text: string;
  };
  series?: Highcharts.SeriesOptionsType[];
  yAxis: {
    labels: {
      formatter: Highcharts.AxisLabelsFormatterCallbackFunction;
    };
    max?: number;
  };
  tooltip: {
    pointFormatter: Highcharts.FormatterCallbackFunction<Highcharts.Point>;
  };
  legend?: boolean;
}

export const useAreaChartState = (
  opts: InitialAreaChartStateInput
): [Highcharts.Options, Dispatch<SetStateAction<Highcharts.Options>>] => {
  const { other } = useMantineTheme();
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    accessibility: {
      enabled: true,
    },
    title: {
      text: opts.title.text,
      style: {
        fontFamily: "Geist Variable, Roboto, Arial, sans-serif",
        fontWeight: "bold",
        fontSize: "16px",
        color: "#dce1e8",
      },
    },
    // This is the rectangle box that u can use to navigate
    navigator: {
      adaptToUpdatedData: true,
      maskFill: other.charts.area.default.navigator.maskFill,
      handles: {
        backgroundColor: other.charts.area.default.navigator.handles.backgroundColor,
      },
      height: 30,
    },

    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },

      area: {
        lineWidth: 1,
        marker: {
          lineWidth: 1,
        },
      },
    },
    xAxis: {
      type: "datetime",
      gridLineColor: other.charts.area.default.gridLineColor,
      lineColor: other.charts.area.default.lineColor,
      labels: {
        step: 2,
        format: "{value:%I:%M %p}",
        style: {
          color: other.charts.area.default.labelColor,
        },
      },
    },
    legend: {
      itemStyle: {
        color: other.charts.area.default.legend.color,
      },
      enabled: opts?.legend ?? false,
    },
    time: {
      useUTC: false,
    },

    yAxis: {
      max: opts.yAxis.max,
      title: {
        text: null,
      },
      startOnTick: true,
      gridLineColor: other.charts.area.default.gridLineColor,
      lineColor: other.charts.area.default.lineColor,
      labels: {
        formatter: opts.yAxis.labels.formatter,
        style: {
          color: "white",
        },
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      xDateFormat: "%Y-%m-%d %I:%M:%S %p",
      pointFormatter: opts.tooltip.pointFormatter,
      style: {
        color: other.charts.area.default.tooltip.color,
      },
      backgroundColor: other.charts.area.default.tooltip.backgroundColor,
    },
    // Scrollbar at the bottom of the chart
    scrollbar: {
      rifleColor: other.charts.area.default.scrollbar.rifleColor,
      barBackgroundColor: other.charts.area.default.scrollbar.barBackgroundColor,
      buttonBackgroundColor: other.charts.area.default.scrollbar.buttonBackgroundColor,
      trackBorderColor: other.charts.area.default.scrollbar.trackBorderColor,
    },
    // This is the calendar thing on the top right
    rangeSelector: {
      inputEnabled: false,
      floating: true,

      labelStyle: {
        color: other.charts.area.default.rangeSelector.labelStyle.color,
        backgroundColor: other.charts.area.default.rangeSelector.labelStyle.backgroundColor,
      },

      inputStyle: {
        color: other.charts.area.default.rangeSelector.inputStyle.color,
      },
      buttonTheme: {
        fill: "none",
        display: "none",
        r: 8,
        style: {
          background: "none",
          color: other.charts.area.default.buttonTheme.style.color,
          backgroundColor: other.charts.area.default.buttonTheme.style.backgroundColor,
          fontWeight: "bold",
        },
      },
      buttons: [
        {
          count: 1,
          type: "minute",
          text: "1m",
        },
        {
          count: 5,
          type: "minute",
          text: "5m",
        },
        {
          count: 30,
          type: "minute",
          text: "30m",
        },
        {
          type: "all",
          text: "All",
        },
      ],

      selected: 0,
    },
    boost: {
      enabled: true,
      useGPUTranslations: false,
      allowForce: true,
    },
    chart: {
      ignoreHiddenSeries: true,
      alignTicks: false,
      backgroundColor: "transparent",
    },
  });

  return [chartOptions, setChartOptions];
};

const AreaChart: React.FC<HighchartsReact.Props> = (props) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const { width } = useViewportSize();

  // Reflow chart on window resize
  useEffect(() => {
    chartComponentRef.current?.chart?.reflow();
  }, [width]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={props.options}
      ref={chartComponentRef}
      constructorType={"stockChart"}
      containerProps={{ style: { height: "100%", width: "100%" } }}
    />
  );
};

export default AreaChart;
