import { Grid,  Title } from "@mantine/core";

const Header = () => {
  return (
    <Grid gutter={"xl"} justify="space-between" style={{ height: "90px" }}>
      <Grid.Col span={3}>
        <Title order={2} color={"#dce1e8"}>
          Dashboard
        </Title>
      </Grid.Col>
    </Grid>
  );
};

export default Header;
