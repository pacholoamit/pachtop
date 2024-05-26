import { AgGridReact } from "ag-grid-react";
import { useCallback } from "react";

import Card from "@/components/card";
import useProcessesSelectors from "@/features/processes/stores/processes.store";
// @ts-ignore
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ColDef, GetRowIdParams, ModuleRegistry } from "@ag-grid-community/core";
import { Space, Text } from "@mantine/core";

interface ProcessTableProps {
  title: string;
  columnDefs: ColDef[];
}

ModuleRegistry.registerModules([ClientSideRowModelModule]);

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

export default ProcessTable;
