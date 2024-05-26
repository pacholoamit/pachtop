import Card from "@/components/card";
import PageWrapper from "@/components/page-wrapper";
import useProcessesSelectors from "@/features/processes/stores/processes.store";
import { Grid, Text } from "@mantine/core";

const TimelineChart = () => {
  return (
    <Card>
      <Text>Timeline Chart</Text>
    </Card>
  );
};

const ProcessesInsights = () => {
  return (
    <Card>
      <Text>Processes Insights</Text>
    </Card>
  );
};

const ProcessesByMemory = () => {
  return (
    <Card>
      <Text>Processes By Memory</Text>
    </Card>
  );
};

const ProcessesByCPU = () => {
  return (
    <Card>
      <Text>Processes By CPU</Text>
    </Card>
  );
};

const ProcessesByTime = () => {
  return (
    <Card>
      <Text>Processes By Time</Text>
    </Card>
  );
};

const ProcessesPage = () => {
  const processes = useProcessesSelectors.use.processes();
  console.log(processes);

  return (
    <PageWrapper name="Processes">
      <Grid>
        <Grid.Col span={8}>
          <TimelineChart />
        </Grid.Col>
        <Grid.Col span={4}>
          <ProcessesInsights />
        </Grid.Col>
        <Grid.Col span={4}>
          <ProcessesByMemory />
        </Grid.Col>
        <Grid.Col span={4}>
          <ProcessesByCPU />
        </Grid.Col>
        <Grid.Col span={4}>
          <ProcessesByTime />
        </Grid.Col>
      </Grid>
    </PageWrapper>
  );
};

export default ProcessesPage;
