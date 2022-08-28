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
import useGetMetrics from "@/hooks/useGetMetrics";

interface AreaChartProps {
  labels: string[];
  chartLabel: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
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
  backgroundColor,
  borderColor,
  chartLabel,
  data: chartData,
  labels,
}) => {
  // const { memory } = useGetMetrics();

  const data = {
    labels,
    datasets: [
      {
        label: chartLabel,
        fill: true,
        data: chartData,
        borderColor: borderColor,
        backgroundColor: backgroundColor,
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
  };

  return <Line data={data} options={options} />;
};

export default AreaChart;
