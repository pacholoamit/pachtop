import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useRef } from "react";

const AreaChart: React.FC<HighchartsReact.Props> = (props) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  const options: Highcharts.Options = {
    ...props.options,
  };

  return <HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} {...props} />;
};

export default AreaChart;
