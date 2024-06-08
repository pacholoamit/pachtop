import { CustomCellRendererProps } from "ag-grid-react";

import formatBytes from "@/features/metrics/utils/format-bytes";
import fromNumberToPercentageString from "@/features/metrics/utils/from-number-to-percentage-string";
import ProcessTable from "@/features/processes/components/processes.table";
import useKillProcess from "@/features/processes/hooks/useKillProcess";
import useComparatorSelector from "@/features/processes/stores/processes-comparator.store";
import { Process } from "@/lib";
import { ColDef } from "@ag-grid-community/core";
import { ActionIcon, Box, Grid, Group, Space, Tabs, Text, Tooltip } from "@mantine/core";
import { IconChartAreaLine, IconCircleX, IconTable, IconTablePlus } from "@tabler/icons-react";

const ActionsColumn = (props: CustomCellRendererProps<Process>) => {
  const addToCompparitorSelected = useComparatorSelector.use.addToComparatorSelected();
  const handleAddToComparitor = () => props.data?.name && addToCompparitorSelected(props.data.name);
  const kill = useKillProcess({});
  const onKill = () => kill(props.data?.name ?? "");

  return (
    <Group align="center" position="center" pt={10}>
      <ActionIcon color="blue" size={"sm"} variant="transparent" onClick={handleAddToComparitor}>
        <IconChartAreaLine />
      </ActionIcon>

      <ActionIcon color="red" size={"sm"} variant="transparent">
        <IconCircleX onClick={onKill} />
      </ActionIcon>
    </Group>
  );
};

const NameColumn = (props: CustomCellRendererProps<Process>) => {
  return (
    <Group align="baseline">
      <Box>
        <img src={props.data?.icon} height={24} />
      </Box>
      <Text sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", flex: 1 }}>{props.value}</Text>
    </Group>
  );
};

const cpuColumns: ColDef[] = [
  { field: "name", flex: 4, filter: true, cellRenderer: NameColumn, cellRendererParams: {} },
  {
    field: "cpuUsage",
    flex: 4,
    headerName: "CPU Usage",
    cellClass: "number",
    cellRenderer: "",
    valueFormatter: ({ value }) => fromNumberToPercentageString(value),
    sort: "desc",
  },
  {
    field: "Actions",
    cellRenderer: ActionsColumn,
    flex: 2,
  },
];

const diskReadColumns: ColDef[] = [
  { field: "name", flex: 4, filter: true, cellRenderer: NameColumn },

  {
    field: "diskUsage.totalReadBytes",
    flex: 4,
    cellRenderer: "",
    headerName: "Reads",
    cellClass: "number",
    valueFormatter: ({ value }) => formatBytes(value ?? 0),
    sort: "desc",
  },
  {
    field: "Actions",
    cellRenderer: ActionsColumn,
    flex: 2,
  },
];

const diskWriteColumns: ColDef[] = [
  { field: "name", flex: 4, filter: true, cellRenderer: NameColumn },
  {
    field: "diskUsage.totalWrittenBytes",
    flex: 4,
    headerName: "Writes",
    cellClass: "number",
    cellRenderer: "",
    valueFormatter: ({ value }) => formatBytes(value ?? 0),
    sort: "desc",
  },
  {
    field: "Actions",
    cellRenderer: ActionsColumn,
    flex: 2,
  },
];

export const allColumns: ColDef[] = [
  { field: "name", flex: 4, filter: true, cellRenderer: NameColumn },
  {
    field: "diskUsage.totalWrittenBytes",
    flex: 4,
    headerName: "Writes",
    cellRenderer: "",
    cellClass: "number",
    valueFormatter: ({ value }) => formatBytes(value ?? 0),
  },
  {
    field: "diskUsage.totalReadBytes",
    flex: 4,
    headerName: "Reads",
    cellRenderer: "",
    cellClass: "number",
    valueFormatter: ({ value }) => formatBytes(value ?? 0),
  },
  {
    field: "cpuUsage",
    flex: 4,
    headerName: "CPU Usage",
    cellClass: "number",
    cellRenderer: "",
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
    cellRenderer: "",
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

const memoryColumns: ColDef[] = [
  { field: "name", flex: 4, filter: true, cellRenderer: NameColumn },
  {
    field: "memoryUsage",
    flex: 4,
    headerName: "RAM Usage",
    cellClass: "number",
    cellRenderer: "",
    valueFormatter: ({ value }) => formatBytes(value),
    sort: "desc",
  },
  {
    field: "Actions",
    cellRenderer: ActionsColumn,
    flex: 2,
  },
];

const MultiTables = () => {
  return (
    <Grid>
      <Grid.Col xl={4} lg={6} md={12}>
        <ProcessTable title="Processes by Memory Usage" columnDefs={memoryColumns} />
      </Grid.Col>
      <Grid.Col xl={4} lg={6} md={12}>
        <ProcessTable title="Processes by CPU Usage" columnDefs={cpuColumns} />
      </Grid.Col>
      <Grid.Col xl={4} lg={6} md={12}>
        <ProcessTable title="Processes by Disk Writes" columnDefs={diskWriteColumns} />
      </Grid.Col>
    </Grid>
  );
};

export default MultiTables;
