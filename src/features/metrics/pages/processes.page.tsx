import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import PageWrapper from "@/components/page-wrapper";
import { Process } from "@/lib/types";
import { Card } from "@mantine/core";

interface ProcessComponentProps {
  process: Process;
}
const ProcessComponent: React.FC<ProcessComponentProps> = ({ process }) => {
  return (
    <Card>
      <h1>{process.name}</h1>
    </Card>
  );
};

const ProcessesPage = () => {
  const { processes } = useMetricsContext();

  return (
    <PageWrapper name="Processes">
      {processes.map((process) => (
        <ProcessComponent process={process} key={process.pid} />
      ))}
    </PageWrapper>
  );
};

export default ProcessesPage;
