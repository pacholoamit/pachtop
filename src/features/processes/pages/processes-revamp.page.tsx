

import { CustomCellRendererProps } from 'ag-grid-react';

import Card from '@/components/card';
import PageWrapper from '@/components/page-wrapper';
import formatBytes from '@/features/metrics/utils/format-bytes';
import fromNumberToPercentageString from '@/features/metrics/utils/from-number-to-percentage-string';
import ProcessComparitor from '@/features/processes/components/processes.comparitor';
import ProcessTable from '@/features/processes/components/processes.table';
import useComparitorSelector from '@/features/processes/stores/processes-comparator.store';
import { Process } from '@/lib';
import { ColDef } from '@ag-grid-community/core';
import {
    ActionIcon, Box, Center, Grid, Group, Image, Space, Tabs, Text, Tooltip
} from '@mantine/core';
import { IconChartAreaLine, IconCircleX, IconTable, IconTablePlus } from '@tabler/icons-react';

// TODO: Make Action Icon X work
const ActionsColumn = (props: CustomCellRendererProps<Process>) => {
  const addToCompparitorSelected = useComparitorSelector.use.addToComparitorSelected();
  const handleAddToComparitor = () => props.data?.name && addToCompparitorSelected(props.data.name);

  return (
    <Group position="center">
      <ActionIcon color="blue" radius={"xl"} size={"sm"} variant="subtle" onClick={handleAddToComparitor}>
        <IconChartAreaLine />
      </ActionIcon>
      <ActionIcon color="red" radius={"xl"} size={"sm"} variant="subtle">
        <IconCircleX />
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
    cellRenderer: "a",
    valueFormatter: ({ value }) => formatBytes(value ?? 0),
    sort: "desc",
  },
  {
    field: "Actions",
    cellRenderer: ActionsColumn,
    flex: 2,
  },
];

const allColumns: ColDef[] = [
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

const ProcessesInsights = () => {
  return (
    <Card>
      <Text>Insights</Text>
    </Card>
  );
};

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

const TAB_OPTIONS = {
  segmented: { value: "segmented", label: "Segmented", icon: <IconTablePlus /> },
  all: { value: "all", label: "All", icon: <IconTable /> },
};

const ProcessesPage = () => {
  return (
    <PageWrapper name="Processes">
      <Grid>
        <Grid.Col xl={12}>
          <ProcessComparitor />
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
