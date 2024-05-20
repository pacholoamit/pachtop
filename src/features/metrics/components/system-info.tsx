import Card from '@/components/card';
import useServerEventsContext from '@/hooks/useServerEventsContext';
import { ScrollArea, Space, Text } from '@mantine/core';

const SystemInfo = () => {
  const { globalCpu, sysInfo } = useServerEventsContext();

  return (
    <Card style={{ height: "300px" }}>
      <ScrollArea offsetScrollbars>
        <Text weight={"bold"} size="md" color={"#dce1e8"}>
          System Information
        </Text>
        <Text size="sm">OS: {sysInfo?.osVersion}</Text>
        <Text size="sm">Host Name: {sysInfo?.hostname}</Text>
        <Text size="sm">Kernel: {sysInfo?.kernelVersion}</Text>
        <Space h="xl" />
        <Text weight={"bold"} size="md" color={"#dce1e8"}>
          CPU Information:
        </Text>
        <Text size="sm">Brand: {globalCpu.at(-1)?.brand}</Text>
        <Text size="sm">Vendor: {globalCpu.at(-1)?.vendor}</Text>
      </ScrollArea>
    </Card>
  );
};

export default SystemInfo;
