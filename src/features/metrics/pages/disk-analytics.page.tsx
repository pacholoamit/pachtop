import { Disk, commands } from "@/lib";
import React from "react";
import { useParams } from "react-router-dom";

interface DiskAnalyticsPageProps {}

const DiskAnalyticsPage: React.FC<DiskAnalyticsPageProps> = () => {
  const { id } = useParams();

  console.log(id);

  const onCheckDisk = async (mountPoint: string) => {
    console.log("Checking disk", mountPoint);
    await commands.deepScan({ path: mountPoint }).then((res) => {
      console.log(res);
    });
  };
  return <div>TODO: DiskAnalyticsPage {id}</div>;
};

export default DiskAnalyticsPage;
