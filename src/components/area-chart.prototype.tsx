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
      xDateFormat: "%I:%M:%S %p",
      pointFormatter: function () {
        return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formatBytes(
          this.y as number
        )}</b><br/>`;
      },
    },

    rangeSelector: {
      labelStyle: {
        color: "#8192ac",
        backgroundColor: "#263858",
      },

      buttonTheme: {
        fill: "none",
        stroke: "none",
        display: "none",
        r: 8,
        state: {
          hover: {
            fill: "#263858",
            style: {
              color: "#dce1e8",
            },
          },
        },
        style: {
          color: "#8192ac",
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
      containerProps={{ style: { height: "100%" } }}
    />
  );
};

export default AreaChart;
