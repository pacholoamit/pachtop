import React, { useEffect } from "react";
import useGetMetrics from "@/hooks/useGetMetrics";
import AreaChart from "../components/area-chart";

const HomePage = () => {
  const { memory } = useGetMetrics();
  return (
    <>
      <AreaChart
        labels={memory.map((mem) => mem.timestamp)}
        backgroundColor={"rgba(53, 162, 235, 0.5)"}
        borderColor={"rgb(53, 162, 235)"}
        data={memory.map((m) => m.used.value)}
      />
    </>
  );
};

export default HomePage;
