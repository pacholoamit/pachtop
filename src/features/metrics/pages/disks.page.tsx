import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import DiskInfo from "@/features/metrics/components/disks/disk.info";
import PageWrapper from "@/components/page-wrapper";

const xAxisMin = Date.now() - 86400;

const DisksPage = () => {
  const { disks } = useMetricsContext();
  return (
    <PageWrapper name="Disks">
      {disks?.map((disk) => (
        <DiskInfo key={disk.id} disk={disk} xAxisMin={xAxisMin} />
      ))}
    </PageWrapper>
  );
};

export default DisksPage;
