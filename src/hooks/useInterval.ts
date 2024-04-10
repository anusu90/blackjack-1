import { useEffect, useRef } from "react";

type Callback = () => void;

/**
 * This is based off this article by Dan Abramov
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 */
export function useInterval(callback: Callback, delay: number | null) {
  const savedCallback = useRef<Callback | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (!savedCallback.current) {
        return;
      }

      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
