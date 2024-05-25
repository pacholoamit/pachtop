import { useEffect, useState } from "react";

import { DefaultMantineColor, MantineNumberSize, Progress, ProgressProps } from "@mantine/core";

export interface DynamicProgressRangeInput {
  from: number;
  to: number;
  color: DefaultMantineColor;
}
export interface DynamicProgressProps extends ProgressProps {
  value?: number;
  range?: DynamicProgressRangeInput[];
  size: MantineNumberSize;
}

export const DEFAULT_RANGE: DynamicProgressRangeInput[] = [
  { from: 0, to: 50, color: "#47d6ab" },
  { from: 50, to: 80, color: "yellow" },
  { from: 80, to: 100, color: "red" },
];

const DynamicProgress: React.FC<DynamicProgressProps> = (props) => {
  const { value = 0, range = DEFAULT_RANGE } = props;
  const [color, setColor] = useState("blue");

  useEffect(() => {
    if (!range && !value) return;
    const currentColor = range.find((r) => value >= r.from && value <= r.to)?.color;
    if (currentColor) setColor(currentColor);
  }, [value, range]);

  return <Progress color={color} {...props} />;
};

export default DynamicProgress;
