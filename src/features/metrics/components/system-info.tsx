import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import Card from "@/components/card";
import { ScrollArea, Space, Text } from "@mantine/core";

const SystemInfo = () => {
  const { globalCpu, sysInfo } = useMetricsContext();

  return (
    <Card style={{ height: "300px" }}>
      <ScrollArea offsetScrollbars>
        <Text weight={"bold"} size="lg" color={"#dce1e8"}>
          System Information
        </Text>
        <Text>OS: {sysInfo?.osVersion}</Text>
        <Text>Host Name: {sysInfo?.hostname}</Text>
        <Text>Kernel: {sysInfo?.kernelVersion}</Text>
        <Space h="xl" />
        <Text weight={"bold"} size="lg" color={"#dce1e8"}>
          CPU Information:
        </Text>
        <Text>Brand: {globalCpu.at(-1)?.brand}</Text>
        <Text>Vendor: {globalCpu.at(-1)?.vendor}</Text>
      </ScrollArea>
    </Card>
  );
};

export default SystemInfo;
