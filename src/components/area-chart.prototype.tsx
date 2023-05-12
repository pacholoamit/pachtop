import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useRef, useState } from "react";

const AreaChart: React.FC<HighchartsReact.Props> = (props) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={props.options}
      ref={chartComponentRef}
      containerProps={{ style: { height: "100%" } }}
    />
  );
};

export default AreaChart;
