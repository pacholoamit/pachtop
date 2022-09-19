import AppProvider from "@/providers";
import AppRoutes from "@/routes";
import "chartjs-adapter-luxon";

const App = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
