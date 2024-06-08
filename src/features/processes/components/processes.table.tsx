import "ag-grid-community/styles/ag-grid.css";
import "@/features/processes/styles/ag-grid-theme-slate.css";
import "@/features/processes/styles/ag-grid-theme-midnight.css";

import { AgGridReact } from "ag-grid-react";
import React, { useCallback } from "react";

import Card from "@/components/card";
import useProcessesSelectors from "@/features/processes/stores/processes.store";
import useTheme from "@/hooks/useTheme";
// @ts-ignore
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ColDef, GetRowIdParams, ModuleRegistry } from "@ag-grid-community/core";
import { ActionIcon, Group, Popover, Space, Text } from "@mantine/core";
import { IconTransform } from "@tabler/icons-react";

interface ProcessTableProps {
  title: string;
  columnDefs: ColDef[];
}

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const ProcessTable: React.FC<ProcessTableProps> = ({ title, columnDefs }) => {
  const { isMidnight } = useTheme();
  const processes = useProcessesSelectors.use.processes();
  const [columnDefState, setColumnDefsState] = React.useState<ColDef[]>(columnDefs);
  const [opened, setOpened] = React.useState(false);
  const getRowId = useCallback((params: GetRowIdParams) => params.data.name, []);

  const onHover = () => {
    setOpened(true);
  };

  const onExitHover = () => setOpened(false);

  const onDisableChangeRenderer = useCallback(() => {
    setColumnDefsState((prev) => {
      return prev.map((column) => {
        if (column.cellRenderer === "agAnimateShowChangeCellRenderer") {
          column.cellRenderer = "";
        } else if (column.cellRenderer === "") {
          column.cellRenderer = "agAnimateShowChangeCellRenderer";
        }
        return column;
      });
    });
  }, []);

  return (
    <Popover opened={opened}>
      <Card height="580px">
        <Group position="apart" pl={4} pr={4}>
          <Text>{title}</Text>
          <Popover.Target>
            <ActionIcon
              radius="xl"
              size="xs"
              variant="subtle"
              onClick={onDisableChangeRenderer}
              onMouseEnter={onHover}
              onMouseLeave={onExitHover}
            >
              <IconTransform />
            </ActionIcon>
          </Popover.Target>
        </Group>

        <Space h={12} />
        <div style={{ height: "100%", width: "100%" }} className={isMidnight ? "ag-theme-midnight" : "ag-theme-slate"}>
          <AgGridReact
            rowData={processes}
            columnDefs={columnDefState as any}
            getRowId={getRowId as any}
            animateRows={false}
          />
        </div>
      </Card>
      <Popover.Dropdown sx={{ pointerEvents: "none" }}>
        <Text size={"sm"}>Toggle change indicators</Text>
      </Popover.Dropdown>
    </Popover>
  );
};

export default ProcessTable;
