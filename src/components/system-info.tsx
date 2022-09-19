import { Card, Text } from "@mantine/core";
import useGetSysinfo from "@/hooks/useGetSysinfo";

const SystemInfo = () => {
  const { sysInfo } = useGetSysinfo();
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
      <Text>OS: {sysInfo?.osVersion}</Text>
      <Text>Host Name: {sysInfo?.hostname}</Text>
      <Text>Kernel: {sysInfo?.kernelVersion}</Text>
    </Card>
  );
};

export default SystemInfo;
