import useGetMetrics from "@/hooks/useGetMetrics";
import AreaChart from "@/components/area-chart";

import { Title } from "@mantine/core";

const HomePage = () => {
  const { memory } = useGetMetrics();
  const unit = memory.slice(-1)[0]?.unit;

  return (
    <>
      <Title>RAM chart</Title>

      <AreaChart
        label={`Ram Used ${unit}`}
        data={memory.map((m) => m.used)}
        labels={memory.map((m) => m.timestamp)}
      />
      <AreaChart
        backgroundColor="rgb(255, 99, 132)"
        borderColor="rgb(255, 99, 132, 0.5)"
        label={`Ram Free ${unit}`}
        data={memory.map((m) => m.free)}
        labels={memory.map((m) => m.timestamp)}
      />
    </>
  );
};

export default HomePage;
