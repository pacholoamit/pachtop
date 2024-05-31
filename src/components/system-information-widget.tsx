import { memo } from "react";

import { GlobalCpu, SysInfo } from "@/lib";
import { Grid, Group, Title } from "@mantine/core";

interface SystemInformationWidgetProps {
  info: SysInfo;
  cpu: GlobalCpu;
}
const SystemInformationWidget: React.FC<SystemInformationWidgetProps> = (props) => {
  const { info, cpu } = props;

  return (
    <Group>
      <Title order={6}>CPU: {cpu.brand}</Title>
      <Title order={6}>CPU cores: {info.coreCount}</Title>
      <Title order={6}>OS: {info.os}</Title>
      <Title order={6}>Kernel: {info.kernelVersion}</Title>
    </Group>
  );
};

const areEqual = (
  prev: Readonly<SystemInformationWidgetProps>,
  next: Readonly<SystemInformationWidgetProps>
): boolean => {
  return (
    prev.cpu.brand === next.cpu.brand &&
    prev.info.coreCount === next.info.coreCount &&
    prev.info.os === next.info.os &&
    prev.info.kernelVersion === next.info.kernelVersion
  );
};

export default memo(SystemInformationWidget, areEqual);
