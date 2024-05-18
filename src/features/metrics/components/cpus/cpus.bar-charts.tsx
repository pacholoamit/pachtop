import useServerEventsContext from "@/hooks/useServerEventsContext";
import { Space, useMantineTheme } from "@mantine/core";

import ReactApexChart from "react-apexcharts";
import Card from "@/components/card";

const CpusBarChart: React.FC = () => {
  const { cpus } = useServerEventsContext();
  const { other } = useMantineTheme();

  const options: ApexCharts.ApexOptions = {
    chart: {
      fontFamily: "Geist, Roboto, Arial, sans-serif",
      toolbar: {
        show: false,
      },
      height: "100%",
    },
    tooltip: {
      custom(options) {
          
      },
    },

    colors: other.charts.bar.cpus.colors,

    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        dataLabels: {},
      },
    },

    title: {
      text: "CPU Threads",
      align: "center",
      style: {
        fontSize: "18px",
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
        show: false,
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
