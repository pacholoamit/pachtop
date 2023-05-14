import * as Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { Dispatch, SetStateAction, useRef } from "react";
import formatBytes from "@/features/metrics/utils/format-bytes";
import { useState } from "react";

export interface InitialAreaChatStateInput {
  title: {
    text: string;
  };
  yAxis: {
    labels: {
      formatter: Highcharts.AxisLabelsFormatterCallbackFunction;
    };
    max?: number;
  };
  tooltip: {
    pointFormatter: Highcharts.FormatterCallbackFunction<Highcharts.Point>;
  };
}

export const useAreaChartState = (
  opts: InitialAreaChatStateInput
): [Highcharts.Options, Dispatch<SetStateAction<Highcharts.Options>>] => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    title: {
      text: opts.title.text,
      style: {
        fontFamily: "Roboto, Arial, sans-serif",
        fontWeight: "bold",
        fontSize: "18px",
        color: "#dce1e8",
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },
    xAxis: {
      type: "datetime",
      gridLineColor: "#263858",
      lineColor: "#263858",
      labels: {
        format: "{value:%I:%M %p}",
        style: {
          color: "#8192ac",
        },
      },
    },
    legend: {
      enabled: false,
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
      gridLineColor: "#263858",
      lineColor: "#263858",
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
        color: "#dce1e8",
      },
      backgroundColor: "#263858",
    },

    rangeSelector: {
      labelStyle: {
        color: "#8192ac",
        backgroundColor: "#263858",
      },
      inputStyle: {
        color: "#8192ac",
      },
      buttonTheme: {
        fill: "none",
        display: "none",
        r: 8,
        style: {
          background: "none",
          color: "#8192ac",
          backgroundColor: "#263858",
          fontWeight: "bold",
        },
      },
      buttons: [
        {
          count: 1,
          type: "minute",
          text: "1M",
        },
        {
          count: 5,
          type: "minute",
          text: "5M",
        },
        {
          count: 30,
          type: "minute",
          text: "30M",
        },

        {
          type: "all",
          text: "All",
        },
      ],
    },

    chart: {
      backgroundColor: "transparent",
      style: {
        color: "#dce1e8",
      },
    },
  });

  return [chartOptions, setChartOptions];
};

const AreaChart: React.FC<HighchartsReact.Props> = (props) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

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
