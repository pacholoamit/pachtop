import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import PageWrapper from "@/components/page-wrapper";

const ProcessesPage = () => {
  const { processes } = useMetricsContext();

  console.log(processes);
  return <PageWrapper name="Processes">Wombo</PageWrapper>;
};

export default ProcessesPage;
