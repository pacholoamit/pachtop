import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import { useEffect } from "react";

const DisksPage = () => {
  const { disks } = useMetricsContext();

  useEffect(() => {
    console.log(disks);
  }, [disks]);

  return <h1>Disks</h1>;
};

export default DisksPage;
