import { useContext } from "react";
import { CustomContext } from "./Provider";
export const useCustomContext = () => {
  return useContext(CustomContext);
};
