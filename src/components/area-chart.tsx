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

const AreaChart: React.FC<AreaChartProps> = (props) => {
  const { data, labels } = props;

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
        label: "Ram Used (MB)",
        fill: true,
        data,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "chart",
      },
    ],
  };

  const options = {
    responsive: true,
    elements: {
      point: {
        borderWidth: 0,
        radius: 0, //Removes point
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
