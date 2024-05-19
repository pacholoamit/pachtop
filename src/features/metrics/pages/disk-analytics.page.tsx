import { Disk } from "@/lib";
import React from "react";
import { useParams } from "react-router-dom";

interface DiskAnalyticsPageProps {}

const DiskAnalyticsPage: React.FC<DiskAnalyticsPageProps> = () => {
  const { id } = useParams();
  return <div>TODO: DiskAnalyticsPage</div>;
};

export default DiskAnalyticsPage;
