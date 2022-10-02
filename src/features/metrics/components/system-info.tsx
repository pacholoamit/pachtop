import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import { Card, Center, Grid, Space, Stack, Text } from "@mantine/core";
import { useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const MemoryRadialChart = () => {
  const { memory } = useMetricsContext();

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: "70%",
          background: "#152847",
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: "front",
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: "#324363",
          strokeWidth: "67%",
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: "#f0f0f0",
            fontSize: "17px",
          },
          value: {
            color: "#f0f0f0",
            fontSize: "24px",
            show: true,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#ABE5A1"],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Memory Used GB"],
  };

  const series: ApexAxisChartSeries | ApexNonAxisChartSeries = [
    memory?.at(-1)?.used || 0,
  ];
  return <ReactApexChart options={options} series={series} type="radialBar" />;
};

const SystemInfo = () => {
  const { globalCpu, sysInfo } = useMetricsContext();

  return (
    <Grid gutter={"xl"}>
      <Grid.Col span={3}>
        <Card
          style={{ minHeight: "310px" }}
          shadow="xl"
          p="sm"
          radius={"md"}
          withBorder
        >
          <Text weight={"bold"} size="lg" color={"#dce1e8"}>
            System Information
          </Text>
          <Text>OS: {sysInfo.at(-1)?.osVersion}</Text>
          <Text>Host Name: {sysInfo.at(-1)?.hostname}</Text>
          <Text>Kernel: {sysInfo.at(-1)?.kernelVersion}</Text>
          <Space h="xl" />
          <Text weight={"bold"} size="lg" color={"#dce1e8"}>
            CPU Information:
          </Text>
          <Text>Brand: {globalCpu.at(-1)?.cpuBrand}</Text>
          <Text>Vendor: {globalCpu.at(-1)?.cpuVendor}</Text>
        </Card>
      </Grid.Col>
      <Grid.Col md={4} lg={3}>
        <Card
          style={{ minHeight: "310px" }}
          shadow="xl"
          p="sm"
          radius={"md"}
          withBorder
        >
          <MemoryRadialChart />
        </Card>
      </Grid.Col>
      <Grid.Col md={4} lg={3}>
        <Card
          style={{ minHeight: "310px" }}
          shadow="xl"
          p="sm"
          radius={"md"}
          withBorder
        >
          <MemoryRadialChart />
        </Card>
      </Grid.Col>
      <Grid.Col md={4} lg={3}>
        <Card
          style={{ minHeight: "310px" }}
          shadow="xl"
          p="sm"
          radius={"md"}
          withBorder
        >
          <MemoryRadialChart />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default SystemInfo;
