import ReactApexChart from 'react-apexcharts';

import Card from '@/components/card';

interface GradientRadialChartProps {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  labels: string[];
}
const GradientRadialChart: React.FC<GradientRadialChartProps> = (props) => {
  const { series, labels } = props;

  const options: ApexCharts.ApexOptions = {
    chart: {
      animations: {
        enabled: false,
      },
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
            fontFamily: "Roboto, Arial, sans-serif",
            fontWeight: "bold",
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
    labels: labels,
  };

  return (
    <Card>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={"305px"}
      />
    </Card>
  );
};

export default GradientRadialChart;
