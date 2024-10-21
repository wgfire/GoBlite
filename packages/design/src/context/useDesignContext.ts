import { useContext, useEffect, useCallback } from "react";
import { DesignContext, DesignContextProps } from "./Provider";
import isEqual from "lodash-es/isEqual";
export const useDesignContext = (initialProps?: DesignContextProps) => {
  const context = useContext(DesignContext);

  if (!context) {
    throw new Error("useDesignContext must be used within a DesignProvider");
  }

  const { state, updateContext } = context;

  useEffect(() => {
    if (initialProps) {
      updateContext(initialProps);
    }
  }, [initialProps]);

  const setContext = useCallback(
    (newValue: Partial<DesignContextProps>) => {
      updateContext(prevState => {
        const updatedState = { ...prevState, ...newValue };
        return isEqual(updatedState, prevState) ? prevState : updatedState;
      });
    },
    [updateContext]
  );

  return { ...state, updateContext: setContext };
};
