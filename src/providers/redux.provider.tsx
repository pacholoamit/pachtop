import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import {
  processesSlice,
  update,
} from "@/features/processes/redux/processes.slice";
import { Command, invoke } from "@/lib";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export const store = configureStore({
  reducer: {
    processes: processesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  useEffect(() => {
    setTimeout(async () => {
      console.log("dispatching");
      const data = await invoke(Command.Processes);
      store.dispatch(update(data));
    }, 1000);
  }, []);

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
