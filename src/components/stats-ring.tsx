import { Box, Center, DefaultMantineColor, Group, Paper, rem, RingProgress, Text } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconArrowDownRight, IconArrowUpRight, TablerIconsProps } from "@tabler/icons-react";

import Card from "./card";

interface StatsRingProps {
  label: string;
  stats: string;
  progress: number;
  color: DefaultMantineColor;
  Icon: (props: TablerIconsProps) => JSX.Element;
}

const StatsRing: React.FC<StatsRingProps> = (props) => {
  const { width } = useViewportSize();

  // const isCardOverflowing = width < 1780; // At 1780px, the card starts to overflow

  // const statsFontSize = isCardOverflowing ? "sm" : "xl";
  // const ringSize = isCardOverflowing ? 50 : 80;
  // const thickness = isCardOverflowing ? 5 : 8;

  return (
    <Card height="100%">
      <Group noWrap>
        <RingProgress
          size={60}
          roundCaps
          thickness={6.5}
          sections={[{ value: props.progress, color: props.color }]}
          label={
            <Center>
              <props.Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
            </Center>
          }
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Text
            c="dimmed"
            size="xs"
            tt="uppercase"
            fw={700}
            sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
          >
            {props.label}
          </Text>
          <Text fw={700} size={"lg"} sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
            {props.stats}
          </Text>
        </Box>
      </Group>
    </Card>
  );
};

export default StatsRing;
