import Chart from "react-apexcharts";

import React from "react";
import { ApexOptions } from "apexcharts";
import { Memory } from "@/lib/types";

interface AreaChartApexProps {
  timestamps?: string[];
  data?: number[];
  memory: Memory[];
}

const AreaChartApex: React.FC<AreaChartApexProps> = ({ memory }) => {
  const series = [
    {
      name: "series1",
      data: memory.map((m) => m.used),
    },
  ];

  const options: ApexOptions = {
    chart: {
      height: 350,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: memory.map((m) => m.timestamp),
    },
    tooltip: {
      x: {
        format: "HH:mm:ss",
      },
    },
  };

  return <Chart options={options} series={series} type="area" height={350} />;
};

export default AreaChartApex;
