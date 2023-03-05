import { listen } from "@tauri-apps/api/event";
import { useEffect, createContext } from "react";

interface ServerEventsProviderProps {
    children: React.ReactNode
}

interface ServerEventsContext {
    data: any
}

export const ServerEventsContext = createContext<ServerEventsContext>({ data: null });


const ServerEventsProvider: React.FC<ServerEventsProviderProps> = ({ children }) => {

    useEffect(() => {
        listen("server-event", (data) => {
            console.log("server-event", data);
        });
    }, [])

    return (
        <ServerEventsContext.Provider value={{ data: null }}>
            {children}
        </ServerEventsContext.Provider>
    )
}

export default ServerEventsProvider;