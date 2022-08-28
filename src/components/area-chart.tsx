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

interface AreaChartProps {
  labels: string[];
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  label: string;
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

const AreaChart: React.FC<AreaChartProps> = ({
  data,
  labels,
  label,
  backgroundColor = "rgba(53, 162, 235, 0.5)",
  borderColor = "rgb(53, 162, 235)",
}) => {
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

  const chartData = {
    labels,
    datasets: [
      {
        label,
        fill: true,
        data,
        borderColor,
        backgroundColor,
        yAxisID: "chart",
      },
    ],
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
      chart: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};
export default AreaChart;
