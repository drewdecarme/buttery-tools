import { useEffect, useState } from "react";

export function useIntervalState<T>(
  data: Array<T>,
  options?: { endless?: boolean; interval?: number; initialIndex?: number }
) {
  const [currentIndex, setCurrentIndex] = useState(options?.initialIndex ?? 0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex > data.length - 1) {
          return 0;
        }
        return nextIndex;
      }); // or whatever transformation you want
    }, options?.interval ?? 3_000);

    return () => clearInterval(intervalId); // cleanup on unmount
  }, [options?.interval, data.length]);

  return data[currentIndex];
}
