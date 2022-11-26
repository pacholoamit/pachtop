import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import PageWrapper from "@/components/page-wrapper";
import { DataTable } from "mantine-datatable";

const ProcessesPage = () => {
  const { processes } = useMetricsContext();

  return (
    <PageWrapper name="Processes">
      <DataTable
        striped
        highlightOnHover
        records={processes}
        columns={[
          { accessor: "pid", textAlignment: "right", title: "PID" },
          { accessor: "name" },
          { accessor: "cpuUsage" },
          { accessor: "memoryUsage" },
          { accessor: "status" },
        ]}
      />
    </PageWrapper>
  );
};

export default ProcessesPage;
