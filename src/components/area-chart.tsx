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
import { Memory } from "@/lib/types";

interface RamUsedProps {
  memory: Memory[];
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

const AreaChart: React.FC<RamUsedProps> = (props) => {
  const { memory } = props;
  // const { memory } = useGetMetrics();

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
    labels: memory.map((m) => m.timestamp),
    datasets: [
      {
        label: "Ram Used (MB)",
        fill: true,
        data: memory.map((m) => m.used),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "used2",
      },
    ],
  };

  const options = {
    responsive: true,
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
      used2: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
      },
    },
  };

  return <Line data={data} options={options} />;
};
export default AreaChart;
