import { invoke, TauriCommand } from "@/lib";
import { useState, useEffect } from "react";

const HomePage = () => {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    invoke(TauriCommand.Memory).then((res) => setData(res as string));
    console.log(data);
  }, []);
  return <h1>Home page!</h1>;
};

export default HomePage;
