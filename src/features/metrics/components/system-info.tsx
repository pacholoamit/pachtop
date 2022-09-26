import { Card, Space, Text } from "@mantine/core";
import { sysInfo, globalCpu } from "@/features/metrics/signals";

const latestInfo = sysInfo.value[0];
const latestGlobalCpu = globalCpu.value[0];

const SystemInfo = () => {
  console.log(latestInfo);
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
      <Text>OS: {latestInfo?.osVersion}</Text>
      <Text>Host Name: {latestInfo?.hostname}</Text>
      <Text>Kernel: {latestInfo?.kernelVersion}</Text>
      <Space h="xl" />
      <Text weight={"bold"} size="lg" color={"#dce1e8"}>
        CPU Information:
      </Text>
      <Text>Brand: {latestGlobalCpu?.cpuBrand}</Text>
      <Text>Vendor: {latestGlobalCpu?.cpuVendor}</Text>
    </Card>
  );
};

export default SystemInfo;
