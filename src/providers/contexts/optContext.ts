import React, { createContext, useContext } from "react";

export type OptContextType = {
  opt: boolean;
  optVal: number | null;
  setOpt: React.Dispatch<React.SetStateAction<boolean>>;
  setOptVal: React.Dispatch<React.SetStateAction<number | null>>;
};

export const OptContext = createContext<OptContextType | undefined>(undefined);

export const useOptContext = () => {
  const ctx = useContext(OptContext);

  if (!ctx) {
    throw new Error(
      "useOptContext must be used within a SupabaseContextProvider"
    );
  }

  return ctx;
};