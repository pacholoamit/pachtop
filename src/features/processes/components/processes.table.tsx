import { AgGridReact } from "ag-grid-react";
import React, { useCallback } from "react";

import Card from "@/components/card";
import useProcessesSelectors from "@/features/processes/stores/processes.store";
// @ts-ignore
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ColDef, GetRowIdParams, ModuleRegistry } from "@ag-grid-community/core";
import { ActionIcon, Group, Space, Text } from "@mantine/core";
import { IconTransform } from "@tabler/icons-react";

interface ProcessTableProps {
  title: string;
  columnDefs: ColDef[];
}

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const ProcessTable: React.FC<ProcessTableProps> = ({ title, columnDefs }) => {
  const processes = useProcessesSelectors.use.processes();
  const [columnDefState, setColumnDefsState] = React.useState<ColDef[]>(columnDefs);
  const getRowId = useCallback((params: GetRowIdParams) => params.data.name, []);

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
    <Card height="580px">
      <Group position="apart" pl={4} pr={4}>
        <Text>{title}</Text>
        <ActionIcon radius="xl" size="xs" variant="subtle" onClick={onDisableChangeRenderer}>
          <IconTransform />
        </ActionIcon>
      </Group>

      <Space h={12} />
      <div style={{ height: "100%", width: "100%" }} className="ag-theme-slate">
        <AgGridReact
          rowData={processes}
          columnDefs={columnDefState as any}
          getRowId={getRowId as any}
          animateRows={false}
        />
      </div>
    </Card>
  );
};

export default ProcessTable;
