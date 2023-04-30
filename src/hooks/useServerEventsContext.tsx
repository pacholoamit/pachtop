import { useContext } from "react";
import { ServerEventsContext } from "@/providers/server-events.context";

const useServerEventsContext = () => useContext(ServerEventsContext);

export default useServerEventsContext;
