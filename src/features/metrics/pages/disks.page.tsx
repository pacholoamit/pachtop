import useServerEventsContext from "@/hooks/useServerEventsContext";
import DiskInfo from "@/features/metrics/components/disks/disk.info";
import PageWrapper from "@/components/page-wrapper";

const xAxisMin = Date.now() - 86400;

const DisksPage = () => {
  const { disks } = useServerEventsContext();
  return (
    <PageWrapper name="Disks">
      {disks?.map((disk) => (
        <DiskInfo key={disk.id} disk={disk} xAxisMin={xAxisMin} />
      ))}
    </PageWrapper>
  );
};

export default DisksPage;
