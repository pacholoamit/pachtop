import { useShallow } from "zustand/react/shallow";

import useGlobalCpuSelectors from "@/features/metrics/stores/global-cpu.store";
import useSystemStoreSelectors from "@/features/metrics/stores/system.store";
import { Group, Title } from "@mantine/core";

const SystemInformationWidget: React.FC = () => {
  const info = useSystemStoreSelectors(useShallow((state) => state.info));
  const cpuBrand = useGlobalCpuSelectors(useShallow((state) => state.latest.brand));

  return (
    <Group>
      <Title order={6}>CPU: {cpuBrand}</Title>
      <Title order={6}>CPU cores: {info.coreCount}</Title>
      <Title order={6}>OS: {info.os}</Title>
      <Title order={6}>Kernel: {info.kernelVersion}</Title>
    </Group>
  );
};

export default SystemInformationWidget;
