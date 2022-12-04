import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export const store = configureStore({
  reducer: {},
});

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
