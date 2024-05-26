import PageWrapper from "@/components/page-wrapper";
import useProcessesSelectors from "@/features/processes/stores/processes.store";
import { Text } from "@mantine/core";

const ProcessesPage = () => {
  const processes = useProcessesSelectors.use.processes();

  return (
    <PageWrapper name="Processes">
      <Text>Helo</Text>
    </PageWrapper>
  );
};

export default ProcessesPage;
