import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { Process } from "@/lib/types";
import { memo } from "react";
import { Button } from "@mantine/core";

import formatBytes from "@/features/metrics/utils/format-bytes";

interface ProcessesTableProps {
  records: Process[];
  setRecords: React.Dispatch<React.SetStateAction<Process[]>>;
  sortStatus: DataTableSortStatus;
  setSortStatus: React.Dispatch<React.SetStateAction<DataTableSortStatus>>;
  selectedProcess: Process | null;
  setSelectedProcess: React.Dispatch<React.SetStateAction<Process | null>>;
}

const ProcessesTable: React.FC<ProcessesTableProps> = memo((props) => {
  const { records, setSortStatus, sortStatus, setSelectedProcess } = props;

  return (
    <>
      <DataTable
        striped
        highlightOnHover
        records={records}
        idAccessor="pid"
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        minHeight={"calc(100vh - 500px)"}
        height={"90vh"}
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
          {
            accessor: "actions",
            render: (record, index) => (
              <Button variant="outline" onClick={() => setSelectedProcess(record)} color="red">
                Kill
              </Button>
            ),
          },
        ]}
      />
    </>
  );
});

export default ProcessesTable;
