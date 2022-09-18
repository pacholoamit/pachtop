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

export interface AreaChartProps {
  labels: string[];
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

const AreaChart: React.FC<AreaChartProps> = ({ labels, datasets }) => {
  const datasetArray = datasets.map((dataset) => ({
    datasets: {
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.backgroundColor,
      borderColor: dataset.borderColor,
      yAxisID: dataset.yAxisId || "y",
      fill: dataset.fill || false,
    },
  }));

  const chartData = {
    labels,
    datasets: datasets.map((dataset) => dataset),
  };

  // const chartData = {
  //   labels,
  //   datasets: [
  //     {
  //       label,
  //       fill: true,
  //       data,
  //       borderColor,
  //       backgroundColor,
  //       yAxisID: "chart",
  //     },
  //     {
  //       label: "Total RAM",
  //       fill: true,
  //     },
  //   ],
  // };

  const options = {
    responsive: true,
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
      },
      title: {
        display: true,
        text: "RAM metrics",
      },
    },
    scales: {
      chart: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
      },
    },
  };

  return <Line data={chartData as any} options={options} />;
};
export default AreaChart;
