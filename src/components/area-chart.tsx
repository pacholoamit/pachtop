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
import "chartjs-adapter-luxon";
import { Card, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export interface AreaChartProps {
  title: string;
  labels: string[] | string[][] | number[];
  datasets: DatasetOptions[];
}

export interface DatasetOptions {
  label: string;
  fill: boolean;
  data: number[] | any[];
  backgroundColor: string;
  borderColor: string;
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

const AreaChart: React.FC<AreaChartProps> = ({ labels, datasets, title }) => {
  const { breakpoints } = useMantineTheme();
  const isXLarge = useMediaQuery(`(min-width: ${breakpoints.xl}px)`);
  const isSmall = useMediaQuery(`(max-width: ${breakpoints.md}px)`);

  const chartData = {
    labels,
    datasets: datasets.map((dataset) => dataset),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    parsing: false,
    animation: false,

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
        algorithm: "lttb",
        samples: 10,
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
        // min: 0,
        ticks: {
          color: "#8192ac",
        },
        grid: {
          color: "#263858",
        },
      },
      xAxis: {
        type: "time",
        time: {
          round: "seconds",
          displayFormats: {
            second: "HH:mm a",
          },
        },

        ticks: {
          color: "#8192ac",
          maxTicksLimit: isXLarge || isSmall ? 10 : 5,
          autoSkip: true,
          maxRotation: 0,
          source: "auto",
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
