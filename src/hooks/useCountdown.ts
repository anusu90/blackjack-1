import { useCallback, useState } from "react";

import { useCounter } from "./useCounter";
import { useInterval } from "./useInterval";

type CountdownOptions = {
  startingNumber: number;
};

type CountdownControllers = {
  startCountdown: () => void;
  /** Stop the countdown. */
  stopCountdown: () => void;
  /** Reset the countdown. */
  resetCountdown: () => void;
};

export function useCountdown({
  startingNumber,
}: CountdownOptions): [number, CountdownControllers] {
  const { count, decrement, reset: resetCounter } = useCounter(startingNumber);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);

  const startCountdown = useCallback(() => {
    setIsCountdownRunning(true);
  }, []);

  const stopCountdown = useCallback(() => {
    setIsCountdownRunning(false);
  }, []);

  // Will set running false and reset the seconds to initial value.
  const resetCountdown = useCallback(() => {
    stopCountdown();
    resetCounter();
  }, [stopCountdown, resetCounter]);

  const countdownCallback = useCallback(() => {
    if (count === 0) {
      stopCountdown();
      return;
    }
    decrement();
  }, [count, decrement, stopCountdown]);

  useInterval(countdownCallback, isCountdownRunning ? 1000 : null);

  return [count, { startCountdown, stopCountdown, resetCountdown }];
}
