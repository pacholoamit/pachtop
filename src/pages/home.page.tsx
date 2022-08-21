import { invoke } from "@tauri-apps/api/tauri";
import React, { useState, useEffect } from "react";

const HomePage = () => {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    invoke("memory").then((res) => setData(res as string));
    console.log(data);
  }, []);
  return <h1>Home page!</h1>;
};

export default HomePage;
