import { useContext } from "react";
import { MetricsContext } from "@/features/metrics/contexts/metrics-context";

const useMetricsContext = () => useContext(MetricsContext);

export default useMetricsContext;
