import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import { useEffect } from "react";

const DisksPage = () => {
  const { disks } = useMetricsContext();

  return <h1>Disks</h1>;
};

export default DisksPage;
