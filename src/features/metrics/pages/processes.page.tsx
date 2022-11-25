import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import PageWrapper from "@/components/page-wrapper";
import { Process } from "@/lib/types";
import { Button, Card, Group } from "@mantine/core";

interface ProcessComponentProps {
  process: Process;
}
const ProcessComponent: React.FC<ProcessComponentProps> = ({ process }) => {
  return (
    <Card shadow={"lg"} p="sm" radius={"md"} withBorder>
      <Group position="apart">
        <Group>
          <h3>{process.name}</h3>
          <p>PID: {process.pid}</p>
          <p>Memory Usage: {process.memoryUsage}</p>
          <p>CPU Usage: {process.cpuUsage}</p>
          <p>Status: {process.status}</p>
        </Group>
        <Group position="right">
          <Button color={"red"}>Kill</Button>
        </Group>
      </Group>
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
