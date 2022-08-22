import React from "react";
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
import { bytesToMegabytes } from "@/utils";

interface IMemoryChart {}

const MemoryChart: React.FC<IMemoryChart> = ({}) => {
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
        label: "Ram Used",
        fill: true,
        data: memory.map((m) => bytesToMegabytes(m.used)),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "used",
      },
      {
        label: "Ram Free",
        fill: true,
        data: memory.map((m) => bytesToMegabytes(m.free)),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "free",
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
      used: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
      },
      free: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

const HomePage = () => {
  return (
    <>
      <TextTitle>Home Page</TextTitle>
      <MemoryChart />
      {/* {memory?.map((m, i) => (
        <React.Fragment key={i}>
          <Text>Free: {m.free} </Text>
          <Text>Used: {m.used} </Text>
          <Text>Total: {m.total} </Text>
          <Text>Timestamp: {m.timestamp} </Text>
        </React.Fragment>
      ))} */}
    </>
  );
};

export default HomePage;
