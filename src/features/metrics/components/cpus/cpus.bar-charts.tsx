import useServerEventsContext from "@/hooks/useServerEventsContext";
import { Space, useMantineTheme } from "@mantine/core";

import ReactApexChart from "react-apexcharts";
import Card from "@/components/card";

const CpusBarChart: React.FC = () => {
  const { cpus } = useServerEventsContext();
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
        formatter(val, opts) {
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

  const last2 = cpus.map((cpu) => ({
    name: cpu.id,
    data: cpu.data.slice(-2),
  }));

  const series: ApexAxisChartSeries = [
    {
      data: last2.map((cpu, i) => {
        return {
          x: cpu.name,
          y: cpu.data[0].usage,
        };
      }),
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
