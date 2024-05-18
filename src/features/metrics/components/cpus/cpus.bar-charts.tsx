import useServerEventsContext from "@/hooks/useServerEventsContext";
import { useMantineTheme } from "@mantine/core";
import { useAreaChartState } from "@/components/area-chart";

import { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import Card from "@/components/card";

const CpusBarChart: React.FC = () => {
  const { cpus } = useServerEventsContext();
  const { other } = useMantineTheme();

  const options: ApexCharts.ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      height: "100%",
    },

    colors: ["#FFFFFF"],

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

      style: {
        fontSize: "16px",
        color: "#f0f0f0",
        fontWeight: "bold",
        fontFamily: "Geist, Roboto, Arial, sans-serif",
      },
    },
    yaxis: {
      labels: {
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
      <ReactApexChart options={options} series={series} height={"100%"} type="bar" />
    </Card>
  );
};

export default CpusBarChart;
