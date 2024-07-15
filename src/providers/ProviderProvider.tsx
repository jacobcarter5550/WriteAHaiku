import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContext } from "./contexts/toastcontextTP.ts";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { toast } from "react-toastify";
import { initGetUser, staticGetUser } from "../store/user/selectors.ts";
import { useAppSelector } from "../store/index.ts";
import { useDispatch } from "react-redux";
import { OptContext } from "./contexts/optContext.ts";

const ProviderProvider: React.FC<{ children: any }> = ({ children }) => {
  const dispatch = useDispatch();

  const user = useAppSelector(staticGetUser);

  useEffect(() => {
    initGetUser()(dispatch);
    console.log(user);
  }, []);

  const showToast = (message) => {
    toast.error(message);
  };

  const [opt, setOpt] = useState<boolean>(false),
    [optVal, setOptVal] = useState<number | null>(null);

  return (
    <>
      <Router>
        <OptContext.Provider value={{ opt, optVal, setOpt, setOptVal }}>
          <ToastContext.Provider value={{ showToast }}>
            <NextThemesProvider attribute="class" defaultTheme="dark">
              {children}
            </NextThemesProvider>
          </ToastContext.Provider>
        </OptContext.Provider>
      </Router>
    </>
  );
};

export default ProviderProvider;
