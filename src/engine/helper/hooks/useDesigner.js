import { createContext, useContext } from "react";

const Ctx = createContext(() => {});

const StoreCtx = createContext({});

const useDesigner = () => {
  return useContext(Ctx);
};

const useView = () => {
  return useContext(StoreCtx);
};

export default {
  Ctx,
  StoreCtx,
  useDesigner,
  useView
};
