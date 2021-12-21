import { createContext, useContext } from "react";

const StoreCtx = createContext({});

const ViewCtx = createContext({});

const useStore = () => {
  return useContext(StoreCtx);
};

const useView = () => {
  return useContext(ViewCtx);
};

export {
  StoreCtx,
  ViewCtx,
  useStore,
  useView
};
