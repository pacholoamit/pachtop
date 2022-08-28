import React, { useEffect } from "react";
import useGetMetrics from "@/hooks/useGetMetrics";

import { Text, Title as TextTitle } from "@mantine/core";
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

import { Memory } from "@/lib/types";
import AreaChart from "@/components/area-chart";

interface IMemoryChart {
  // memory: Memory[];
  // setLength: React.Dispatch<React.SetStateAction<number>>;
}

const MemoryChart: React.FC<IMemoryChart> = (props) => {
  // const { memory } = props;
  const { memory } = useGetMetrics();

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

const HomePage = () => {
  const { memory } = useGetMetrics();
  return (
    <>
      <TextTitle>RAM chart</TextTitle>

      {/* <MemoryChart /> */}
      <AreaChart memory={memory} />
    </>
  );
};

export default HomePage;
