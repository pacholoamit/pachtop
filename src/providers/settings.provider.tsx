import { createContext } from 'react';

interface SettingsProviderProps {
  children: React.ReactNode;
}
// TODO: implement this
export const SettingsContext = createContext({});

const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  return <SettingsContext.Provider value={{}}>{children}</SettingsContext.Provider>;
};

export default SettingsProvider;
