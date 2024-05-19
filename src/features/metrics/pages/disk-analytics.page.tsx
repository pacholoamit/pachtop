import React, { useCallback, useEffect } from "react";
import { flattenTree, INode } from "react-accessible-treeview";
import { IFlatMetadata } from "react-accessible-treeview/dist/TreeView/utils";
import { useParams } from "react-router-dom";

import Card from "@/components/card";
import PageWrapper from "@/components/page-wrapper";
import DiskDirectoryTreeView from "@/features/metrics/components/disks/disk.directory-treeview";
import DiskInformationAnalyticsCard from "@/features/metrics/components/disks/disk.information-analytics";
import useServerEventsContext from "@/hooks/useServerEventsContext";
import { commands, Disk } from "@/lib";
import { Grid, LoadingOverlay, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const FileExplorerNoData = () => {
  return (
    <Stack align="center" justify="center" spacing="xs" pt={"86px"}>
      <Title
        order={1}
        style={{
          textAlign: "center",
          fontWeight: 600,
          fontSize: "3rem",
        }}
      >
        No Data
      </Title>
      <Text c="dimmed" size="md" ta="center">
        Click on "Start Disk Analysis" to start analyzing the disk.
      </Text>
    </Stack>
  );
};

interface DiskAnalyticsPageProps {}

const defaultDisk: Disk = {
  diskType: "unknown",
  fileSystem: "unknown",
  free: 0,
  isRemovable: false,
  mountPoint: "unknown",
  total: 0,
  name: "unknown",
  timestamp: BigInt(0),
  used: 0,
  usedPercentage: 0,
};

const deepCompare = <A, B>(a: A, b: B) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

const MemoizedDiskDirectoryTreeView = React.memo(DiskDirectoryTreeView, (prevProps, nextProps) =>
  deepCompare(prevProps.data, nextProps.data)
);

const DiskAnalyticsPage: React.FC<DiskAnalyticsPageProps> = () => {
  // TODO: Use Stores to make this more performant
  const { disks } = useServerEventsContext();
  const { id = "" } = useParams();
  const [disk, setDisk] = React.useState<Disk>(defaultDisk);
  const [diskAnalysis, setDiskAnalysis] = React.useState<INode<IFlatMetadata>[]>([]);

  const [isLoading, setIsLoading] = React.useState(false);
  const isDiskAnalysisEmpty = diskAnalysis.length === 0;

  useEffect(() => {
    if (!disks) return;
    const disk = disks.find((d) => d.id === id);

    if (disk?.data?.length ?? 0 > 0) {
      setDisk(disk?.data?.at(-1) || defaultDisk);
    }
  }, []);

  const startDiskAnalysis = useCallback(async () => {
    setIsLoading(true);

    const item = await commands.deepScan({ path: disk.mountPoint });
    setDiskAnalysis(
      flattenTree({
        name: disk.mountPoint,
        children: item as any,
      })
    );

    setIsLoading(false);
  }, [disk.mountPoint]); // Adding disk.mountPoint as dependency

  return (
    <PageWrapper name={id}>
      <Grid>
        <Grid.Col span={3}>
          <DiskInformationAnalyticsCard disk={disk} startDiskAnalysis={startDiskAnalysis} />
        </Grid.Col>
        <Grid.Col span={9}>
          <Card height="350px">
            <LoadingOverlay visible={isLoading} overlayBlur={3} />
            <Title order={4}>File Explorer</Title>

            {isDiskAnalysisEmpty ? <FileExplorerNoData /> : <MemoizedDiskDirectoryTreeView data={diskAnalysis} />}
          </Card>
        </Grid.Col>
        <Grid.Col span={12}>
          <Card height="560px">
            <Text>Chart goes here</Text>
          </Card>
        </Grid.Col>
      </Grid>
    </PageWrapper>
  );
};

export default DiskAnalyticsPage;
