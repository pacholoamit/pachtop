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
} from "chart.js";
import { Card } from "@mantine/core";

export interface AreaChartProps {
  title: string;
  labels: string[] | string[][];
  datasets: DatasetOptions[];
}

export interface DatasetOptions {
  label: string;
  fill: boolean;
  data: number[];
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
  Legend
);

const AreaChart: React.FC<AreaChartProps> = ({ labels, datasets, title }) => {
  const chartData = {
    labels,
    datasets: datasets.map((dataset) => dataset),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0, // Turn off animation
    },
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
        ticks: {
          color: "#8192ac",
          maxTicksLimit: 8,
          autoSkip: true,
          maxRotation: 0,
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
      p="xl"
      radius={"md"}
      withBorder
    >
      <Line data={chartData as any} options={options as any} />
    </Card>
  );
};
export default AreaChart;
