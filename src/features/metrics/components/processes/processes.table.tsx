import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { Process } from "@/lib/types";
import { useState, useEffect, memo } from "react";
import { Button, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";

import sortBy from "lodash.sortby";
import formatBytes from "@/features/metrics/utils/format-bytes";
import KillProcessVerification from "@/features/metrics/components/processes/processes.kill-verification";

interface ProcessesTableProps {
  processes: Process[];
}

const ProcessesTable: React.FC<ProcessesTableProps> = memo(({ processes }) => {
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState(sortBy(processes, "name"));
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "name",
    direction: "asc",
  });

  useEffect(() => {
    const filteredRecords = processes.filter((process) => {
      const filteredName = process.name
        .toLowerCase()
        .includes(query.toLowerCase());
      const filteredPid = process.pid
        .toString()
        .toLowerCase()
        .includes(query.toLowerCase());

      return filteredName || filteredPid;
    });
    setRecords(sortBy(filteredRecords, sortStatus.columnAccessor));
  }, [query]);

  useEffect(() => {
    const data = sortBy(processes, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
  }, [sortStatus]);

  return (
    <>
      <TextInput
        placeholder="Search Process..."
        icon={<IconSearch size={16} />}
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
      />
      <DataTable
        striped
        highlightOnHover
        records={records}
        idAccessor="pid"
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        minHeight={"calc(100vh - 190px)"}
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
              <Button
                variant="outline"
                onClick={() => setSelectedProcess(record)}
                color="red"
              >
                Kill
              </Button>
            ),
          },
        ]}
      />
      <KillProcessVerification
        selectedProcess={selectedProcess}
        setSelectedProcess={setSelectedProcess}
        setRecords={setRecords}
      />
    </>
  );
});

export default ProcessesTable;
