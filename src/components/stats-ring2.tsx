import { Center, DefaultMantineColor, RingProgress, Stack, Text } from "@mantine/core";
import { IconCpu, TablerIconsProps } from "@tabler/icons-react";

interface StatsRingProps {
  label: string;
  stats: string;
  progress: number;
  color: DefaultMantineColor;
  Icon: (props: TablerIconsProps) => JSX.Element;
}

const StatsRing: React.FC<StatsRingProps> = (props) => {
  return (
    <Center>
      <Stack align="center">
        <Text
          c="dimmed"
          size="xs"
          tt="uppercase"
          fw={700}
          sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
        >
          {props.label}
        </Text>

        <RingProgress
          size={120}
          roundCaps
          thickness={6.5}
          sections={[{ value: props.progress, color: props.color }]}
          label={
            <Center>
              <Text fw={700} size={"lg"} sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {props.stats}
              </Text>
            </Center>
          }
        />
      </Stack>
    </Center>
  );
};

export default StatsRing;
