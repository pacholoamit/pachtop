import { Divider, Grid, Text } from '@mantine/core';

interface DashboardSectionsDividerProps {
  label: string;
}
const DashboardSectionsDivider = ({ label }: DashboardSectionsDividerProps) => {
  return (
    <>
      <Grid.Col span={12}>
        <Divider
          my="xs"
          label={
            <>
              <Text c="dimmed" size="sm" tt="uppercase" weight={700}>
                {label}
              </Text>
            </>
          }
        />
      </Grid.Col>
    </>
  );
};

export default DashboardSectionsDivider;
