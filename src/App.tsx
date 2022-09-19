import AppProvider from "@/providers";
import AppRoutes from "@/routes";


const App = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
