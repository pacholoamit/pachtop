import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import GradientRadialChart from "@/components/gradient-radial-chart";
import Card from "@/components/card";
import { Grid, Space, Text } from "@mantine/core";

const SystemInfo = () => {
  const { globalCpu, sysInfo } = useMetricsContext();

  return (
    <Card style={{ height: "300px" }}>
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
      <Text>Brand: {globalCpu.at(-1)?.brand}</Text>
      <Text>Vendor: {globalCpu.at(-1)?.vendor}</Text>
    </Card>
  );
};

export default SystemInfo;
