import AppProvider from "@/providers";
import AppRoutes from "@/routes";

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
