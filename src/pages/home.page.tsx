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

interface IMemoryChart {
  setLength: React.Dispatch<React.SetStateAction<number>>;
}

const MemoryChart: React.FC<IMemoryChart> = ({ setLength }) => {
  const { memory } = useGetMetrics();

  useEffect(() => {
    setLength(memory.length);
    console.log(memory);
  }, [memory.length]);

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
        yAxisID: "used",
      },
      // {
      //   label: "Ram Free",
      //   fill: true,
      //   data: memory.map((m) => m.free),
      //   borderColor: "rgb(255, 99, 132)",
      //   backgroundColor: "rgba(255, 99, 132, 0.5)",
      //   yAxisID: "free",
      // },
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
      used: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
      },
      // free: {
      //   stacked: true,
      //   type: "linear" as const,
      //   display: true,
      //   position: "right" as const,
      //   grid: {
      //     drawOnChartArea: false,
      //   },
      // },
    },
  };

  return <Line data={data} options={options} />;
};

const HomePage = () => {
  const [length, setLength] = React.useState(0);
  return (
    <>
      <TextTitle>RAM chart length: {length.toString()}</TextTitle>
      <MemoryChart setLength={setLength} />
    </>
  );
};

export default HomePage;
