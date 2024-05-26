import "ag-grid-community/styles/ag-grid.css";
import "@/features/processes/styles/ag-grid-theme-slate.css";

import { AgGridReact } from "ag-grid-react";
import { DataTable } from "mantine-datatable";
import React, { useCallback, useEffect, useState } from "react";

import Card from "@/components/card";
import PageWrapper from "@/components/page-wrapper";
import formatBytes from "@/features/metrics/utils/format-bytes";
import formatSecondsToReadable from "@/features/metrics/utils/format-seconds-time";
import fromNumberToPercentageString from "@/features/metrics/utils/from-number-to-percentage-string";
import useProcessesSelectors from "@/features/processes/stores/processes.store";
// @ts-ignore
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ColDef, GetRowIdParams, ModuleRegistry } from "@ag-grid-community/core";
import { ActionIcon, Grid, Group, Space, Tabs, Text, TextInput } from "@mantine/core";
import { IconCircleX, IconTable, IconTablePlus } from "@tabler/icons-react";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const ActionsColumn = () => {
  return (
    <Group position="center">
      <ActionIcon color="red" radius={"xl"} size={"sm"} variant="subtle">
        <IconCircleX />
      </ActionIcon>
    </Group>
  );
};

const TimelineChart = () => {
  return (
    <Card>
      <Text>Timeline Chart</Text>
    </Card>
  );
};

const ProcessesInsights = () => {
  return (
    <Card>
      <Text>Processes Insights</Text>
    </Card>
  );
};

interface ProcessTableProps {
  title: string;
  columnDefs: ColDef[];
}

const memoryColumns: ColDef[] = [
  { field: "name", flex: 4, filter: true },
  {
    field: "memoryUsage",
    flex: 4,
    headerName: "RAM Usage",
    cellClass: "number",
    cellRenderer: "agAnimateShowChangeCellRenderer",
    valueFormatter: ({ value }) => formatBytes(value),
    sort: "desc",
  },
  {
    field: "Actions",
    cellRenderer: ActionsColumn,
    flex: 2,
  },
];

const cpuColumns: ColDef[] = [
  { field: "name", flex: 4, filter: true },
  {
    field: "cpuUsage",
    flex: 4,
    headerName: "CPU Usage",
    cellClass: "number",
    cellRenderer: "agAnimateShowChangeCellRenderer",
    valueFormatter: ({ value }) => fromNumberToPercentageString(value),
    sort: "desc",
  },
  {
    field: "Actions",
    cellRenderer: ActionsColumn,
    flex: 2,
  },
];

const diskColumns: ColDef[] = [
  { field: "name", flex: 4, filter: true },
  {
    field: "diskUsage.totalWrittenBytes",
    flex: 4,
    headerName: "Writes",
    cellClass: "number",
    valueFormatter: ({ value }) => formatBytes(value ?? 0),
    sort: "desc",
  },
  {
    field: "diskUsage.totalReadBytes",
    flex: 4,
    headerName: "Reads",
    cellClass: "number",
    valueFormatter: ({ value }) => formatBytes(value ?? 0),
    sort: "desc",
  },
];

const allColumns: ColDef[] = [
  { field: "name", flex: 4, filter: true, sort: "asc" },
  {
    field: "diskUsage.totalWrittenBytes",
    flex: 4,
    headerName: "Writes",
    cellClass: "number",
    valueFormatter: ({ value }) => formatBytes(value ?? 0),
  },
  {
    field: "diskUsage.totalReadBytes",
    flex: 4,
    headerName: "Reads",
    cellClass: "number",
    valueFormatter: ({ value }) => formatBytes(value ?? 0),
  },
  {
    field: "cpuUsage",
    flex: 4,
    headerName: "CPU Usage",
    cellClass: "number",
    cellRenderer: "agAnimateShowChangeCellRenderer",
    valueFormatter: ({ value }) => fromNumberToPercentageString(value),
  },
  // {
  //   field: "runTime",
  //   flex: 4,
  //   headerName: "Run Time",
  //   cellClass: "number",
  //   cellRenderer: "agAnimateShowChangeCellRenderer",
  //   valueFormatter: ({ value }) => formatSecondsToReadable(value),
  // },
  {
    field: "memoryUsage",
    flex: 4,
    headerName: "RAM Usage",
    cellClass: "number",
    cellRenderer: "agAnimateShowChangeCellRenderer",
    valueFormatter: ({ value }) => formatBytes(value),
  },
  {
    field: "root",
    flex: 3,
    headerName: "Installed on",
  },
  {
    field: "Actions",
    cellRenderer: ActionsColumn,
    flex: 2,
  },
];

const ProcessTable: React.FC<ProcessTableProps> = ({ title, columnDefs }) => {
  const processes = useProcessesSelectors.use.processes();
  const getRowId = useCallback((params: GetRowIdParams) => params.data.name, []);

  return (
    <Card height="580px">
      <Text>{title}</Text>
      <Space h={12} />
      <div style={{ height: "100%", width: "100%" }} className="ag-theme-slate">
        <AgGridReact
          rowData={processes}
          columnDefs={columnDefs as any}
          getRowId={getRowId as any}
          animateRows={false}
        />
      </div>
    </Card>
  );
};

const MultiTables = () => {
  return (
    <Grid>
      <Grid.Col xl={4} lg={6}>
        <ProcessTable title="Processes by Memory Usage" columnDefs={memoryColumns} />
      </Grid.Col>
      <Grid.Col xl={4} lg={6}>
        <ProcessTable title="Processes by CPU Usage" columnDefs={cpuColumns} />
      </Grid.Col>
      <Grid.Col xl={4} lg={6}>
        <ProcessTable title="Processes by Disk Usage" columnDefs={diskColumns} />
      </Grid.Col>
    </Grid>
  );
};

const TAB_OPTIONS = {
  segmented: { value: "segmented", label: "Segmented", icon: <IconTablePlus /> },
  all: { value: "all", label: "All", icon: <IconTable /> },
};

const ProcessesPage = () => {
  const [isMultiTables, setIsMultiTables] = useState(false);
  return (
    <PageWrapper name="Processes">
      <Grid>
        <Grid.Col xl={8} lg={6}>
          <TimelineChart />
        </Grid.Col>
        <Grid.Col xl={4} lg={6}>
          <ProcessesInsights />
        </Grid.Col>
        <Grid.Col span={12}>
          <Tabs defaultValue={TAB_OPTIONS.segmented.value}>
            <Tabs.List>
              <Tabs.Tab color="teal" icon={TAB_OPTIONS.segmented.icon} value={TAB_OPTIONS.segmented.value} />
              <Tabs.Tab color="red" icon={TAB_OPTIONS.all.icon} value={TAB_OPTIONS.all.value} />
            </Tabs.List>
            <Space h={20} />
            <Tabs.Panel value={TAB_OPTIONS.segmented.value}>
              <MultiTables />
            </Tabs.Panel>
            <Tabs.Panel value={TAB_OPTIONS.all.value}>
              <ProcessTable title="All Processes" columnDefs={allColumns} />
            </Tabs.Panel>
          </Tabs>
        </Grid.Col>
      </Grid>
    </PageWrapper>
  );
};

export default ProcessesPage;
