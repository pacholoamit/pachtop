import useGetMetrics from "@/hooks/useGetMetrics";
import AreaChart from "@/components/area-chart";

import { Title } from "@mantine/core";

const HomePage = () => {
  const { memory } = useGetMetrics();
  const label = `Ram Used ${memory.length ? `(${memory[0].unit})` : ""}`;
  return (
    <>
      <Title>RAM chart</Title>

      <AreaChart
        label={label}
        data={memory.map((m) => m.used)}
        labels={memory.map((m) => m.timestamp)}
      />
    </>
  );
};

export default HomePage;
