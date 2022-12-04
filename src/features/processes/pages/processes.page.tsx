import { DataTableSortStatus } from "mantine-datatable";
import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { Process } from "@/lib/types";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import sortBy from "lodash.sortby";
import KillProcessVerification from "@/features/processes/components/processes.kill-verification";
import ProcessesTable from "@/features/processes/components/processes.table";
import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import PageWrapper from "@/components/page-wrapper";
import { RootState, useAppDispatch } from "../../../providers/redux.provider";

let renders = 0;

const ProcessesPage = () => {
  // const { processes } = useMetricsContext();

  const processes = useSelector<RootState>(
    (state) => state.processes.value
  ) as Process[];

  const [query, setQuery] = useState("");
  const [records, setRecords] = useState(sortBy(processes, "name"));
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "name",
    direction: "asc",
  });

  console.log(renders++);

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
    <PageWrapper name="Processes">
      <TextInput
        placeholder="Search Process..."
        icon={<IconSearch size={16} />}
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
      />
      <ProcessesTable
        records={records}
        selectedProcess={selectedProcess}
        setSelectedProcess={setSelectedProcess}
        setRecords={setRecords}
        setSortStatus={setSortStatus}
        sortStatus={sortStatus}
      />
      <KillProcessVerification
        selectedProcess={selectedProcess}
        setSelectedProcess={setSelectedProcess}
        setRecords={setRecords}
      />
    </PageWrapper>
  );
};

export default ProcessesPage;
