import { useEffect } from "react";
import ReactApexChart from "react-apexcharts";

import BarChart, { useBarChartState } from "@/components/bar-chart";
import Card from "@/components/card";
import useCpusSelectors from "@/features/metrics/stores/cpus.store";
import fromNumberToPercentageString from "@/features/metrics/utils/from-number-to-percentage-string";
import { Space, useMantineTheme } from "@mantine/core";

// const CpusBarChart: React.FC = () => {
//   const cpus = useCpusSelectors.use.cpus();
//   const { other } = useMantineTheme();

//   const options: ApexCharts.ApexOptions = {
//     fill: {
//       type: "gradient",
//       gradient: {
//         shade: "dark",
//         type: "vertical",
//         shadeIntensity: 0.5,
//         gradientToColors: other.charts.bar.cpus.gradientColors,
//         inverseColors: true,
//         opacityFrom: 1,
//         opacityTo: 0.8,
//         stops: [0],
//       },
//     },
//     chart: {
//       fontFamily: "Geist, Roboto, Arial, sans-serif",
//       toolbar: {
//         show: false,
//       },
//       height: "100%",
//     },
//     tooltip: {
//       theme: "dark",
//       enabled: false,
//     },

//     colors: other.charts.bar.cpus.colors,

//     dataLabels: {
//       enabled: false,
//     },
//     plotOptions: {
//       bar: {
//         dataLabels: {
//           hideOverflowingLabels: true,
//         },
//       },
//     },

//     title: {
//       text: "CPU Threads",
//       align: "center",
//       style: {
//         fontSize: "16px",
//         color: "#dce1e8",
//         fontWeight: "bold",
//         fontFamily: "Geist, Roboto, Arial, sans-serif",
//       },
//     },
//     yaxis: {
//       labels: {
//         formatter(val, opts) {
//           return `${val}%`;
//         },
//         style: {
//           colors: "#f0f0f0",
//           fontFamily: "Geist, Roboto, Arial, sans-serif",
//         },
//       },
//     },
//     xaxis: {
//       labels: {
//         style: {
//           colors: "#f0f0f0",
//           fontFamily: "Geist, Roboto, Arial, sans-serif",
//         },
//       },
//     },
//   };

//   const series: ApexAxisChartSeries = [
//     {
//       data: cpus.map((cpu) => ({
//         x: cpu.name,
//         y: cpu.usage,
//       })),
//     },
//   ];

//   return (
//     <Card style={{ height: "380px" }}>
//       <Space h={1} />
//       <ReactApexChart options={options} series={series} height={"100%"} type="bar" />
//     </Card>
//   );
// };

const CpusBarChart: React.FC = () => {
  const { other } = useMantineTheme();
  const [chartOptions, setChartOptions] = useBarChartState({
    custom: {
      title: "CPU Threads",
      yAxisMax: 100,
      yaAxisFormatter: (x) => `${fromNumberToPercentageString(x.value as number)}`,
      tooltipPointFomatter: function () {
        return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${fromNumberToPercentageString(
          this.y || 0
        )}</b><br/>`;
      },
      plotOptionsColumn: {
        color: {
          stops: [
            [0, "rgba(236, 18, 120,0.75)"],
            [1, "rgba(236, 18, 120, 0)"],
          ],
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        },
      },
    },

    xAxis: {
      crosshair: true,
    },
  });
  const cpus = useCpusSelectors.use.cpus();

  useEffect(() => {
    setChartOptions((prev) => ({
      ...prev,
      xAxis: {
        categories: cpus.map((cpu) => cpu.name),
      },
      series: [
        {
          name: "Usage",
          type: "column",
          data: cpus.map((cpu) => cpu.usage),
        },
      ],
    }));
  }, [cpus]);
  return (
    <Card style={{ height: "380px" }}>
      <BarChart options={chartOptions} />
    </Card>
  );
};
export default CpusBarChart;
