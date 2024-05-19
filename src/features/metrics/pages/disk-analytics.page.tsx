import { commands } from "@/lib";
import React from "react";
import { useParams } from "react-router-dom";
import PageWrapper from "@/components/page-wrapper";
import DiskNotFound from "@/features/metrics/components/disks/disk.notfound";
import { Text, Stack, Title, Center, Container } from "@mantine/core";

interface DiskAnalyticsPageProps {}

const DiskAnalyticsPage: React.FC<DiskAnalyticsPageProps> = () => {
  const { id = "" } = useParams();

  const onCheckDisk = async (mountPoint: string) => {
    console.log("Checking disk", mountPoint);
    await commands.deepScan({ path: mountPoint }).then((res) => {
      console.log(res);
    });
  };

  if (!id) return <DiskNotFound />;

  return (
    <PageWrapper name={id}>
      <div>TODO: DiskAnalyticsPage {id}</div>
    </PageWrapper>
  );
};

export default DiskAnalyticsPage;
