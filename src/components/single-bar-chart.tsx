import ReactApexChart from "react-apexcharts";
import useMediaQuery from "@/hooks/useMediaQuery";

interface SingleBarChartProps {
  series: SeriesData;
}

interface SeriesData {
  name: string;
  data: number[];
}

const SingleBarChart: React.FC<SingleBarChartProps> = ({ series }) => {
  const { isLargerThanXl } = useMediaQuery();
  // const width = isLargerThanXl ? 350 : "100%";
  const seriesData: ApexAxisChartSeries = [series];
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
      text: series.name,
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
      text: series.data[0].toString() + "%",
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
    <ReactApexChart
      options={options}
      series={seriesData}
      type="bar"
      height={70}
      // width={width}
    />
  );
};

export default SingleBarChart;
