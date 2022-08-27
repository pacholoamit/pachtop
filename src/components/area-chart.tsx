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
  borderColor: string;
  backgroundColor: string;
}

const AreaChart: React.FC<AreaChartProps> = (props) => {
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

  const data = {
    labels: props.labels,
    datasets: [
      {
        label: "Ram Usage (GB)",
        fill: true,
        data: props.data,
        borderColor: props.borderColor,
        backgroundColor: props.backgroundColor,
        yAxisID: "used",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      used: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default AreaChart;
