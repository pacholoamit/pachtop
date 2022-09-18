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
  const chartData = {
    labels,
    datasets: datasets.map((dataset) => dataset),
  };

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
      yAxis: {
        min: 0,
      },
    },
  };

  return <Line data={chartData as any} options={options as any} />;
};
export default AreaChart;
