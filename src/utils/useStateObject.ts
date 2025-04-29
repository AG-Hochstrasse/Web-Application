import { useState } from "react";

export default function useStateObject<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);

  const setStateObject = (newState: Partial<T>) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  return [state, setStateObject] as const;
}