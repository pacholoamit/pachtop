import { invoke, TauriCommand } from "@/lib";
import { Text, Title } from "@mantine/core";
import React, { useState, useEffect } from "react";
import useGetMetrics from "../hooks/useGetMetrics";

const HomePage = () => {
  const { memory } = useGetMetrics();

  return (
    <>
      <Title>Home Page</Title>
      {memory?.map((m, i) => (
        <React.Fragment key={i}>
          <Text>Free: {m.free} </Text>
          <Text>Used: {m.used} </Text>
          <Text>Total: {m.total} </Text>
        </React.Fragment>
      ))}
    </>
  );
};

export default HomePage;
