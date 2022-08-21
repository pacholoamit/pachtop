interface AppProvider {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProvider> = ({ children }) => {
  console.log("hello world 2");
  return <>{children}</>;
};

export default AppProvider;
