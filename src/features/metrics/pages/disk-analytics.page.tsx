import React, { useCallback, useEffect } from "react";
import { flattenTree, INode } from "react-accessible-treeview";
import { IFlatMetadata } from "react-accessible-treeview/dist/TreeView/utils";
import { useParams } from "react-router-dom";

import Card from "@/components/card";
import PageWrapper from "@/components/page-wrapper";
import TreemapChart, { useTreemapChartState } from "@/components/treemap-chart";
import DiskDirectoryTreeView from "@/features/metrics/components/disks/disk.directory-treeview";
import DiskInformationAnalyticsCard from "@/features/metrics/components/disks/disk.information-analytics";
import { commands } from "@/lib";
import { Grid, LoadingOverlay, Stack, Text, Title } from "@mantine/core";

import useDisksStore from "../stores/disk.store";
import formatBytes from "../utils/format-bytes";

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

const MemoizedTreemapChart = React.memo(TreemapChart);

const MemoizedDiskDirectoryTreeView = React.memo(DiskDirectoryTreeView);

// TODO: Desperately needs refactoring
const DiskAnalyticsPage: React.FC<DiskAnalyticsPageProps> = () => {
  const { id = "" } = useParams();
  const disk = useDisksStore.use.selectedDisk();

  const [diskAnalysis, setDiskAnalysis] = React.useState<INode<IFlatMetadata>[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const isDiskAnalysisEmpty = diskAnalysis.length === 0;

  const [chartOptions, setChartOptions] = useTreemapChartState({
    title: {
      text: `Disk Usage`,
    },

    yAxis: {
      labels: {
        formatter: (x) => formatBytes(x.value as number),
      },
    },
  });

  const startDiskAnalysis = useCallback(async () => {
    setIsLoading(true);

    const item = await commands.deepScan({ path: disk.mountPoint });

    setIsLoading(false);
    // Populate File Explorer
    // Navigate into the root since it's a directory
    setDiskAnalysis(item.children as any);

    // console.log(item.children);

    // const flattened = flattenTree(item as any);

    // console.log(item.children);

    // // TODO: Move to rust?
    // const stortedBySize = flattened.sort((a, b) => {
    //   return (b.metadata?.size as number) - (a.metadata?.size as number);
    // });

    // // Remove roout node and get top 500
    // const sample = stortedBySize.slice(1, 100);

    // console.log(sample);

    // const data = sample.map((i) => {
    //   const id = i.id.toString();
    //   const name = i.name || "unknown";
    //   const value = i.metadata?.size ?? 0;

    //   if (!i.parent) {
    //     return { id, name, value };
    //   }

    //   return {
    //     id,
    //     name,
    //     parent: i.parent.toString(),
    //     value,
    //   };
    // });

    // setChartOptions((prev) => ({
    //   series: [
    //     {
    //       type: "treemap",
    //       layoutAlgorithm: "squarified",
    //       animationLimit: 1000,
    //       allowTraversingTree: true,
    //       allowPointSelect: true,
    //       accessibility: {
    //         exposeAsGroupOnly: true,
    //       },
    //       dataLabels: {
    //         enabled: false,
    //       },
    //       levels: [
    //         {
    //           level: 1,
    //           dataLabels: {
    //             enabled: true,
    //           },
    //           borderWidth: 3,
    //           layoutAlgorithm: "squarified",
    //           color: colors.dark[6], // TODO: Create own color for this
    //           borderColor: colors.dark[3], // TODO: Create own color for this
    //         },
    //         {
    //           level: 1,
    //           dataLabels: {
    //             style: {
    //               fontSize: "14px",
    //             },
    //           },
    //           color: colors.dark[6], // TODO: Create own color for this
    //           borderColor: colors.dark[3], // TODO: Create own color for this
    //         },
    //       ],
    //       data: data as any, //TODO: Crutch fix this later
    //     },
    //   ],
    // }));

    // console.log("Done");
  }, [disk.mountPoint]);

  return (
    <PageWrapper name={id}>
      <Grid>
        <Grid.Col span={3}>
          <DiskInformationAnalyticsCard startDiskAnalysis={startDiskAnalysis} />
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
            Disk Usage
            {/* <MemoizedTreemapChart options={chartOptions} /> */}
          </Card>
        </Grid.Col>
      </Grid>
    </PageWrapper>
  );
};

export default DiskAnalyticsPage;
