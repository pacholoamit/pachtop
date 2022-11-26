import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { Process } from "@/lib/types";
import { useState, useEffect, memo } from "react";

import sortBy from "lodash.sortby";
import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import PageWrapper from "@/components/page-wrapper";
import formatBytes from "@/features/metrics/utils/format-bytes";

interface ProcessesTableProps {
  processes: Process[];
}

const ProcessesTable: React.FC<ProcessesTableProps> = memo(({ processes }) => {
  const [records, setRecords] = useState(sortBy(processes, "name"));
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "name",
    direction: "asc",
  });

  useEffect(() => {
    const data = sortBy(processes, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
  }, [sortStatus]);

  return (
    <DataTable
      striped
      highlightOnHover
      records={records}
      idAccessor="pid"
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      minHeight={"calc(100vh - 190px)"}
      columns={[
        {
          accessor: "pid",
          textAlignment: "right",
          title: "PID",
          sortable: true,
        },
        { accessor: "name", sortable: true },
        {
          accessor: "cpuUsage",
          render: ({ cpuUsage }) => `${Math.round(cpuUsage * 100) / 100}%`,
          sortable: true,
          title: "CPU Usage",
        },
        {
          accessor: "memoryUsage",
          sortable: true,
          render: ({ memoryUsage }) => formatBytes(memoryUsage),
        },
        { accessor: "status", sortable: true },
      ]}
    />
  );
});

const ProcessesPage = () => {
  const { processes } = useMetricsContext();

  return (
    <PageWrapper name="Processes">
      <ProcessesTable processes={processes} />
    </PageWrapper>
  );
};

export default ProcessesPage;
