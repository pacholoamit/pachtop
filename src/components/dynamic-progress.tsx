import { DefaultMantineColor, Progress } from "@mantine/core";
import { useState, useEffect } from "react";

export interface DynamicProgressRangeInput {
  from: number;
  to: number;
  color: DefaultMantineColor;
}
export interface DynamicProgressProps {
  value: number;
  range?: DynamicProgressRangeInput[];
}

const DynamicProgress: React.FC<DynamicProgressProps> = (props) => {
  const { value, range } = props;
  const [color, setColor] = useState("blue");

  useEffect(() => {
    if (!range) return;
    const currentColor = range.find((r) => value >= r.from && value <= r.to)?.color;
    if (currentColor) setColor(currentColor);
  }, [value, range]);

  return <Progress value={value} color={color} size={"xs"} />;
};

export default DynamicProgress;
