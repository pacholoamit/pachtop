import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import { Card, Space, Text } from "@mantine/core";

const SystemInfo = () => {
  const { globalCpu, sysInfo } = useMetricsContext();

  return (
    <Card
      style={{ height: "300px" }}
      shadow="xl"
      p="sm"
      radius={"md"}
      withBorder
    >
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
  );
};

export default SystemInfo;
