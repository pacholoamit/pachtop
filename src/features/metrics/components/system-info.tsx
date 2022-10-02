import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import GradientRadialChart from "@/components/gradient-radial-chart";
import Card from "@/components/card";
import { Grid, Space, Text } from "@mantine/core";

const MemoryRadialChart = () => {
  const { memory } = useMetricsContext();

  const series: ApexAxisChartSeries | ApexNonAxisChartSeries = [
    memory?.at(-1)?.used_percentage || 0,
  ];
  return <GradientRadialChart labels={["RAM Usage"]} series={series} />;
};

const SystemInfo = () => {
  const { globalCpu, sysInfo } = useMetricsContext();

  return (
    <Grid gutter={"xl"}>
      <Grid.Col sm={6} md={6} lg={4} xl={3}>
        <Card style={{ height: "310px" }}>
          <Text weight={"bold"} size="lg" color={"#dce1e8"}>
            System Information
          </Text>
          <Text>OS: {sysInfo.at(-1)?.osVersion}</Text>
          <Text>Host Name: {sysInfo.at(-1)?.hostname}</Text>
          <Text>Kernel: {sysInfo.at(-1)?.kernelVersion}</Text>
          <Space h="xl" />
          <Text weight={"bold"} size="lg" color={"#dce1e8"}>
            CPU Information:
          </Text>
          <Text>Brand: {globalCpu.at(-1)?.cpuBrand}</Text>
          <Text>Vendor: {globalCpu.at(-1)?.cpuVendor}</Text>
        </Card>
      </Grid.Col>
      <Grid.Col sm={6} md={6} lg={4} xl={3}>
        <Card style={{ height: "310px" }}>
          <MemoryRadialChart />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default SystemInfo;
