import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import Card from "@/components/card";
import PageWrapper from "@/components/page-wrapper";
import TreemapChart, { useTreemapChartState } from "@/components/treemap-chart";
import DiskDirectoryTreeView from "@/features/metrics/components/disks/disk.directory-treeview";
import DiskInformationAnalyticsCard from "@/features/metrics/components/disks/disk.information-analytics";
import { commands, DiskItem } from "@/lib";
import { Grid, LoadingOverlay, Stack, Text, Title, useMantineTheme } from "@mantine/core";

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
  const { colors } = useMantineTheme();

  const [diskAnalysis, setDiskAnalysis] = React.useState<DiskItem[]>([]);
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

    const rootFsTree = await commands.disk_analysis({ path: disk.mountPoint }).then((res) => {
      setIsLoading(false);
      return res;
    });

    // Populate File Explorer
    setDiskAnalysis(rootFsTree.children as DiskItem[]);

    const flattened = await commands.disk_analysis_flattened({ path: disk.mountPoint });

    const flattenedTreemapData = flattened.map((item) => {
      return {
        id: item.id,
        name: item.name,
        value: item.size,
      };
    });

    setChartOptions((prev) => ({
      ...prev,
      series: [
        {
          type: "treemap",
          layoutAlgorithm: "squarified",
          animationLimit: 1000,
          allowTraversingTree: true,
          allowPointSelect: true,
          accessibility: {
            exposeAsGroupOnly: true,
          },
          dataLabels: {
            enabled: false,
          },
          levels: [
            {
              level: 1,
              colorVariation: {
                key: "brightness",
                to: 0.5,
              },
              dataLabels: {
                enabled: true,
                style: {
                  fontFamily: "Geist Variable, Roboto, Arial, sans-serif",
                },
              },
              borderWidth: 0.5,
              layoutAlgorithm: "squarified",
              color: colors.dark[6], // TODO: Create own color for this
              borderColor: colors.dark[3], // TODO: Create own color for this
            },
          ],
          data: flattenedTreemapData, //TODO: Crutch fix this later
        },
      ],
    }));

    // console.log("Done");
  }, [disk.mountPoint]);

  return (
    <PageWrapper name={id}>
      <Grid>
        <Grid.Col md={12} lg={4} xl={3}>
          <DiskInformationAnalyticsCard startDiskAnalysis={startDiskAnalysis} />
        </Grid.Col>
        <Grid.Col md={12} lg={8} xl={9}>
          <Card height="350px">
            <LoadingOverlay visible={isLoading} overlayBlur={3} />
            <Title order={4}>File Explorer</Title>
            {isDiskAnalysisEmpty ? <FileExplorerNoData /> : <MemoizedDiskDirectoryTreeView data={diskAnalysis} />}
          </Card>
        </Grid.Col>
        <Grid.Col xl={12}>
          <Card height="560px">
            <MemoizedTreemapChart options={chartOptions} />
          </Card>
        </Grid.Col>
      </Grid>
    </PageWrapper>
  );
};

export default DiskAnalyticsPage;
