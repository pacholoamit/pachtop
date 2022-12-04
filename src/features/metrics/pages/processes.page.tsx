import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import PageWrapper from "@/components/page-wrapper";
import ProcessesTable from "@/features/metrics/components/processes/processes.table";

const ProcessesPage = () => {
  const { processes } = useMetricsContext();

  return (
    <PageWrapper name="Processes">
      <ProcessesTable processes={processes} />
    </PageWrapper>
  );
};

export default ProcessesPage;
