import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  Decimation,
  TimeScale,
} from "chart.js";

import { Card } from "@mantine/core";
import useMediaQuery from "@/hooks/useMediaQuery";
import "chartjs-adapter-luxon";

export interface AreaChartProps {
  title: string;
  labels: string[] | string[][] | number[];
  xAxisMin?: any;
  datasets: DatasetOptions[];
  stacked?: boolean;
}

export interface DatasetOptions {
  label: string;
  fill: boolean;
  data: number[] | any[];
  backgroundColor?: string;
  borderColor?: string;
  yAxisId: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  Decimation,
  TimeScale
);

const AreaChart: React.FC<AreaChartProps> = ({
  labels,
  datasets,
  title,
  xAxisMin = undefined,
  stacked = false,
}) => {
  const { isSmallerThanMd, isLargerThanXl, isSmallerThanXs } = useMediaQuery();

  const maxTicksLimit =
    isLargerThanXl || (isSmallerThanMd && !isSmallerThanXs) ? 8 : 4;

  const chartData = {
    labels,
    datasets: datasets.map((dataset) => dataset),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    parsing: false,
    animation: false,
    spanGaps: true,
    tooltip: {
      mode: "index",
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    elements: {
      point: {
        borderWidth: 0,
        radius: 0, // Makes points invisible unless hovered
        backgroundColor: "rgba(0,0,0,0)",
      },
    },
    plugins: {
      decimation: {
        enabled: true,
        algorithm: "min-max" as const,
        samples: 60,
        threshold: 60,
      },
      legend: {
        position: "top" as const,
        labels: {
          color: "#8192ac",
        },
      },
      title: {
        display: true,
        text: title,
        color: "#dce1e8",
        align: "start" as const,
        font: {
          family: "Roboto",
          weight: "bold",
          size: 18,
        },
      },
    },
    scales: {
      yAxis: {
        min: 0,
        ticks: {
          color: "#8192ac",
        },
        grid: {
          color: "#263858",
        },
      },
      xAxis: {
        min: xAxisMin,
        type: "time",
        stacked,
        time: {
          round: "seconds",
          displayFormats: {
            millisecond: "hh:mm a",
            second: "hh:mm a",
          },
        },

        ticks: {
          color: "#8192ac",
          maxTicksLimit: maxTicksLimit,
          autoSkip: true,
          maxRotation: 0,
          source: "auto",
          align: "end",
        },
        grid: {
          color: "#263858",
        },
      },
    },
  };

  return (
    <Card
      style={{ height: "300px" }}
      shadow="xl"
      p="sm"
      radius={"md"}
      withBorder
    >
      <Line data={chartData as any} options={options as any} />
    </Card>
  );
};
export default AreaChart;
