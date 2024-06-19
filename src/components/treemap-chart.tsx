import Highcharts, { Point } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsTreemap from "highcharts/modules/treemap";
import DarkUnica from "highcharts/themes/dark-unica";
import React, { Dispatch, memo, SetStateAction, useEffect, useRef, useState } from "react";

import formatBytes from "@/features/metrics/utils/format-bytes";
import { useMantineTheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

HighchartsTreemap(Highcharts);
DarkUnica(Highcharts);

export interface InitialTreemapChartStateInput extends Highcharts.Options {
  custom?: {
    title: {
      text: string;
    };
    series?: Highcharts.SeriesOptionsType[];
    yAxis?: {
      labels: {
        formatter: Highcharts.AxisLabelsFormatterCallbackFunction;
      };
      max?: number;
    };

    legend?: boolean;
  };
}

// Crutch because types are incorrect in HighChartsReact lib
interface FormatterScope extends Point {
  value: number;
}

export const useTreemapChartState = (
  opts: InitialTreemapChartStateInput
): [Highcharts.Options, Dispatch<SetStateAction<Highcharts.Options>>] => {
  const { colors, primaryColor } = useMantineTheme();
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    accessibility: {
      enabled: true,
    },

    tooltip: {
      backgroundColor: colors.dark[6],
      formatter: function () {
        // TODO: Move this to Disk to be more generic

        const point: FormatterScope = this.point as FormatterScope;
        return `<b>${this.point.name}</b>: ${formatBytes(point["value"]) as any}`;
      },
    },
    chart: {
      backgroundColor: "transparent",
      style: {
        fontFamily: "Geist Variable, Roboto, Arial, sans-serif",
      },
    },
    boost: {
      enabled: true,
      useGPUTranslations: true,
      allowForce: true,
      usePreallocated: true,
    },
    title: {
      text: opts.custom?.title.text || "",

      style: {
        fontFamily: "Geist Variable, Roboto, Arial, sans-serif",
        fontWeight: "700",
        fontSize: "18",
        color: "#c1c2c5",
      },
    },
    credits: {
      enabled: false,
    },
    series: [],
  });

  return [chartOptions, setChartOptions];
};

const TreemapChart: React.FC<HighchartsReact.Props> = (props) => {
  const { width } = useViewportSize();
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  // Reflow chart on window resize
  useEffect(() => {
    chartComponentRef.current?.chart?.reflow();
  }, [width]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={props.options}
      ref={chartComponentRef}
      containerProps={{ style: { height: "100%", width: "100%" } }}
    />
  );
};

export default memo(TreemapChart);
