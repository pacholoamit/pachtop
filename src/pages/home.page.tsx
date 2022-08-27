import React from "react";
import useGetMetrics from "@/hooks/useGetMetrics";
import AreaChart from "../components/area-chart";

const HomePage = () => {
  const { memory } = useGetMetrics();
  const chartLabel = `Ram usage ${memory.pop()?.unit ?? ""}`;

  React.useEffect(() => {
    console.log(memory);
  }, [memory]);

  return (
    <>
      <AreaChart
        labels={memory.map((mem) => mem.timestamp)}
        data={memory.map((m) => m.used)}
        chartLabel={chartLabel}
        backgroundColor={"rgba(53, 162, 235, 0.5)"}
        borderColor={"rgb(53, 162, 235)"}
      />
    </>
  );
};

export default HomePage;
