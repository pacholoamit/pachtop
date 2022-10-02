import ReactApexChart from "react-apexcharts";
import Card from "@/components/card";

interface BarChartProps {}

const BarChart: React.FC<BarChartProps> = () => {
  const series: ApexAxisChartSeries = [
    {
      name: "Process 2",
      data: [80],
    },
  ];
  const options: ApexCharts.ApexOptions = {
    chart: {
      stacked: true,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "20%",
        colors: {
          backgroundBarColors: ["#40475D"],
        },
      },
    },
    colors: ["#17ead9"],
    stroke: {
      width: 0,
    },

    title: {
      floating: true,
      offsetX: -10,
      offsetY: 5,
      text: "Process 2",
      style: {
        fontSize: "16px",
        color: "#f0f0f0",
        fontWeight: "bold",
        fontFamily: "Roboto, Arial, sans-serif",
      },
    },
    subtitle: {
      floating: true,
      align: "right",
      offsetY: 0,
      text: "80%",
      style: {
        fontSize: "20px",
        color: "#f0f0f0",
        fontWeight: "bold",
        fontFamily: "Roboto, Arial, sans-serif",
      },
    },
    tooltip: {
      enabled: false,
    },
    xaxis: {
      categories: ["Process 2"],
    },
    yaxis: {
      max: 100,
    },
    fill: {
      type: "gradient",
      gradient: {
        inverseColors: false,
        gradientToColors: ["#6078ea"],
      },
    },
  };
  return (
    <Card>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={70}
      />
    </Card>
  );
};

export default BarChart;
