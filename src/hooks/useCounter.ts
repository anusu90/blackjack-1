import { useCallback, useState } from "react";

type UseCounterReturnType = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (value: number) => void;
};

export function useCounter(initialValue?: number): UseCounterReturnType {
  const [count, setCount] = useState(initialValue ?? 0);

  const increment = useCallback(() => {
    setCount((x) => x + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((x) => x - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue ?? 0);
  }, [initialValue]);

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  };
}
