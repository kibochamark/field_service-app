import { AutoLogoutProvider } from "@/utils/AutoLogout";
import { createContext, useContext } from "react";


const AutoLogoutContext = createContext("");

export const AutoLogoutProviderWrapper = ({ children }:{children:React.ReactNode}) => {
  return (
    <AutoLogoutProvider>
      <AutoLogoutContext.Provider value={""}>
        {children}
      </AutoLogoutContext.Provider>
    </AutoLogoutProvider>
  );
};

export const useAutoLogoutContext = () => {
  return useContext(AutoLogoutContext);
};
