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
import AreaChart from "@/components/area-chart";
import AreaChartApex from "@/components/area-chart-apex";
import { Memory } from "@/lib/types";

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
    },
  };

  return <Line data={data} options={options} />;
};

const HomePage = () => {
  const { memory } = useGetMetrics();
  const chartLabel = `Ram usage ${memory.pop()?.unit ?? ""}`;

  return (
    <>
      <TextTitle>RAM chart</TextTitle>
      <AreaChart
        labels={memory.map((m) => m.timestamp)}
        data={memory.map((m) => m.used)}
        chartLabel={chartLabel}
        backgroundColor={"rgba(53, 162, 235, 0.5)"}
        borderColor={"rgb(53, 162, 235)"}
      />
      <AreaChartApex
        memory={memory}
        data={memory.map((m) => m.used)}
        timestamps={memory.map((m) => m.timestamp)}
      />
      <MemoryChart />
    </>
  );
};

export default HomePage;
