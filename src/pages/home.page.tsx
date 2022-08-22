import { Text, Title } from "@mantine/core";
import { Line } from "react-chartjs-2";
import React from "react";
import useGetMetrics from "@/hooks/useGetMetrics";

interface IMemoryChart {}

const MemoryChart: React.FC<IMemoryChart> = ({}) => {
  const { memory } = useGetMetrics();

  const data = {
    labels: memory.map((m) => m.timestamp),
    datasets: [
      {
        label: "Used",
        fill: true,
        data: memory.map((m) => m.used),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
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
        text: "Chart.js Line Chart",
      },
    },
  };

  return <Line data={data} options={options} />;
};

const HomePage = () => {
  return (
    <>
      <Title>Home Page</Title>
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
