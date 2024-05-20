import { Container, Stack, Text, Title } from '@mantine/core';

// TODO: maybe make this more generic later to be reused in other places?
const DiskNotFound = () => {
  return (
    <Container pt={"30vh"}>
      <Stack spacing="xl" align="center" justify="center">
        <Title
          order={1}
          style={{
            textAlign: "center",
            fontWeight: 900,
            fontSize: "3rem",
          }}
        >
          Disk not found
        </Title>
        <Title
          size="xl"
          ta="center"
          style={{
            textAlign: "center",
            fontWeight: 900,
            fontSize: "2rem",
          }}
        >
          You have found a secret place.
        </Title>
        <Text c="dimmed" size="xl" ta="center">
          There was unfortunately no disk found at this location.
        </Text>
      </Stack>
    </Container>
  );
};

export default DiskNotFound;
