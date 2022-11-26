import { DataTable } from "mantine-datatable";

import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import PageWrapper from "@/components/page-wrapper";
import formatBytes from "@/features/metrics/utils/format-bytes";
import logger from "@/lib/logger";

const ProcessesPage = () => {
  const { processes } = useMetricsContext();

  return (
    <PageWrapper name="Processes">
      <DataTable
        striped
        highlightOnHover
        records={processes}
        columns={[
          { accessor: "pid", textAlignment: "right", title: "PID" },
          { accessor: "name" },
          {
            accessor: "cpuUsage",
            render: ({ cpuUsage }) => `${Math.round(cpuUsage * 100) / 100}%`,
            ellipsis: true,
            title: "CPU Usage",
          },
          {
            accessor: "memoryUsage",
            render: ({ memoryUsage }) => formatBytes(memoryUsage),
          },
          { accessor: "status" },
        ]}
      />
    </PageWrapper>
  );
};

export default ProcessesPage;
