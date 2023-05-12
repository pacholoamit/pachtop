import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useRef, useState } from "react";
import formatBytes from "@/features/metrics/utils/format-bytes";

const defaultOptions: Highcharts.Options = {
  title: {
    text: "Random Access Memory (RAM)",
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
  colors: [
    {
      linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
      stops: [
        [0, "rgba(10, 167, 147, 1)"],
        [1, "rgba(10, 167, 147, 0.45)"],
      ],
    },
  ],

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

  yAxis: {
    title: {
      text: null,
    },
    gridLineColor: "#263858",
    lineColor: "#263858",
    labels: {
      formatter: (x) => formatBytes(x.value as number),
      style: {
        color: "#8192ac",
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
  chart: {
    backgroundColor: "transparent",
    style: {
      color: "#dce1e8",
    },
  },
};

const AreaChart: React.FC<HighchartsReact.Props> = (props) => {
  const [options, setOptions] = useState<Highcharts.Options>(defaultOptions);
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    if (props.options) {
      setOptions({ ...props.options, ...defaultOptions });
    }
  }, [props.options]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
      containerProps={{ style: { height: "100%" } }}
    />
  );
};

export default AreaChart;
