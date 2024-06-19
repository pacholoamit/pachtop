import React, { useCallback } from "react";
import { useParams } from "react-router-dom";

import Card from "@/components/card";
import PageWrapper from "@/components/page-wrapper";
import TreemapChart, { useTreemapChartState } from "@/components/treemap-chart";
import DiskDirectoryTreeView from "@/features/metrics/components/disks/disk.directory-treeview";
import DiskInformationAnalyticsCard from "@/features/metrics/components/disks/disk.information-analytics";
import useDisksStore from "@/features/metrics/stores/disk.store";
import formatBytes from "@/features/metrics/utils/format-bytes";
import { commands, DiskAnalysisProgress, DiskItem, streams } from "@/lib";
import logger from "@/lib/logger";
import notification from "@/utils/notification";
import { Box, Center, Grid, LoadingOverlay, Progress, Stack, Text, Title, useMantineTheme } from "@mantine/core";

interface AnalysisProgressIndicatorProps {
  enableStatus?: boolean;
  progress: DiskAnalysisProgress;
  pt: string;
}
const AnalysisIndicator: React.FC<AnalysisProgressIndicatorProps> = (props) => {
  const { progress, enableStatus = false } = props;
  const isShowProgress = progress.total > 0 && progress.scanned > 0 && enableStatus;

  if (isShowProgress) {
    const percentage = (props.progress.scanned / props.progress.total) * 100;
    const isScanningCompleted = props.progress.scanned === props.progress.total;
    const scanningProgress = `Scanned ${formatBytes(props.progress.scanned)} of ${formatBytes(props.progress.total)}`;
    const serializingProgress = `Scanning completed, serializing data...`;
    return (
      <Stack align="center" justify="center" spacing="xs" pt={props.pt}>
        <Title order={3}>{isScanningCompleted ? serializingProgress : scanningProgress}</Title>
        <Box style={{ width: "300px" }}>
          <Progress value={percentage} size={"lg"} color="cyan" />
        </Box>
      </Stack>
    );
  }
  return (
    <Stack align="center" justify="center" spacing="xs" pt={props.pt}>
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

const DiskAnalyticsPage: React.FC<DiskAnalyticsPageProps> = () => {
  const { id = "" } = useParams();
  const disk = useDisksStore.use.selectedDisk();
  const { colors } = useMantineTheme();
  const [diskAnalysis, setDiskAnalysis] = React.useState<DiskItem[]>([]);
  const [progress, setProgress] = React.useState<DiskAnalysisProgress>({ scanned: 0, total: 0 });
  const [isLoading, setIsLoading] = React.useState(false);
  const isDiskScanEmpty = diskAnalysis.length === 0;

  const [chartOptions, setChartOptions] = useTreemapChartState({
    title: {
      text: `Largest Files in ${disk.mountPoint}`,
    },
    yAxis: {
      labels: {
        formatter: (x) => formatBytes(x.value as number),
      },
    },
  });

  const startDiskAnalysis = useCallback(async () => {
    try {
      setIsLoading(true);

      const fs = await commands.scan((stream) => setProgress(stream), {
        path: disk.mountPoint,
        diskName: disk.name,
        isTurbo: true,
      });

      logger.trace("Disk analysis sample:", fs.children);
      setDiskAnalysis(fs.children as DiskItem[]);

      await populateTreemap();
    } catch (err) {
      logger.error(err);

      notification.error({
        title: "Failed to start disk analysis",
        message: "Please try again or restart the app",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const populateTreemap = useCallback(async () => {
    if (disk.mountPoint) {
      const flattened = await commands.disk_analysis_flattened({ path: disk.mountPoint });

      const flattenedTreemapData = flattened.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.size,
      }));

      logger.trace("Tree map sample:", flattenedTreemapData.slice(0, 10));

      setChartOptions((prev) => ({
        series: [
          {
            turboThreshold: 0,
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
                // color: colors.dark[6], // TODO: Create own color for this
                // borderColor: colors.dark[3], // TODO: Create own color for this
              },
            ],
            data: flattenedTreemapData, //TODO: Crutch fix this later
          },
        ],
      }));
    }
  }, [disk.mountPoint, colors.dark, setChartOptions]);

  return (
    <PageWrapper name={id}>
      <Grid>
        <Grid.Col md={12} lg={4} xl={3}>
          <DiskInformationAnalyticsCard startDiskAnalysis={startDiskAnalysis} />
        </Grid.Col>
        <Grid.Col md={12} lg={8} xl={9}>
          <Card height="400px">
            <Title order={4}>File Explorer</Title>
            {isDiskScanEmpty ? (
              <AnalysisIndicator progress={progress} enableStatus={true} pt="86px" />
            ) : (
              <DiskDirectoryTreeView data={diskAnalysis} />
            )}
          </Card>
        </Grid.Col>
        <Grid.Col xl={12}>
          <Card height="540px">
            <Center>
              <Title order={4}>Disk Usage</Title>
            </Center>
            {isDiskScanEmpty ? (
              <AnalysisIndicator progress={progress} pt="188px" />
            ) : (
              <TreemapChart options={chartOptions} />
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </PageWrapper>
  );
};
export default DiskAnalyticsPage;
