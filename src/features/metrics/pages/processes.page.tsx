const xAxisMin = Date.now() - 86400;
import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import { Stack } from "@mantine/core";

const ProcessesPage = () => {
  const { processes } = useMetricsContext();

  console.log(processes);
  return (
    <Stack spacing="xl">
      <h2>Processes</h2>
    </Stack>
  );
};

export default ProcessesPage;
