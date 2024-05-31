import ReactApexChart from "react-apexcharts";

import Card from "@/components/card";
import useCpusSelectors from "@/features/metrics/stores/cpus.store";
import { Space, useMantineTheme } from "@mantine/core";

const CpusBarChart: React.FC = () => {
  const cpus = useCpusSelectors.use.cpus();
  const { other } = useMantineTheme();

  const options: ApexCharts.ApexOptions = {
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: other.charts.bar.cpus.gradientColors,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0],
      },
    },
    chart: {
      fontFamily: "Geist, Roboto, Arial, sans-serif",
      toolbar: {
        show: false,
      },
      height: "100%",
    },
    tooltip: {
      theme: "dark",
      enabled: false,
    },

    colors: other.charts.bar.cpus.colors,

    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        dataLabels: {
          hideOverflowingLabels: true,
        },
      },
    },

    title: {
      text: "CPU Threads",
      align: "center",
      style: {
        fontSize: "16px",
        color: "#dce1e8",
        fontWeight: "bold",
        fontFamily: "Geist, Roboto, Arial, sans-serif",
      },
    },
    yaxis: {
      labels: {
        formatter(val) {
          return `${val}%`;
        },
        style: {
          colors: "#f0f0f0",
          fontFamily: "Geist, Roboto, Arial, sans-serif",
        },
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: "#f0f0f0",
          fontFamily: "Geist, Roboto, Arial, sans-serif",
        },
      },
    },
  };

  const series: ApexAxisChartSeries = [
    {
      data: cpus.map((cpu) => ({
        x: cpu.name,
        y: cpu.usage,
      })),
    },
  ];

  return (
    <Card style={{ height: "410px" }}>
      <Space h={1} />
      <ReactApexChart options={options} series={series} height={"100%"} type="bar" />
    </Card>
  );
};

export default CpusBarChart;
