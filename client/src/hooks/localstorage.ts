import { Dispatch, useCallback, useEffect, useState } from "react";

export default function useLocalStorage<M>(key: string): [M, Dispatch<M>] {
  const [value, setValue] = useState<M>(() =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    JSON.parse(window.localStorage.getItem(key) || '""')
  );

  const setItem = useCallback(
    (valueToSet: M): void => {
      window.localStorage.setItem(key, JSON.stringify(valueToSet));
    },
    [key]
  );

  const handleStorageEvent = useCallback(
    (event: StorageEvent) => {
      if (
        event.key === key &&
        JSON.stringify(event.newValue) !== JSON.stringify(value)
      ) {
        setValue((event.newValue as unknown) as M);
      }
    },
    [value, key]
  );

  useEffect(() => {
    const oldValue = window.localStorage.getItem(key);

    if (JSON.stringify(value) !== JSON.stringify(oldValue)) {
      setItem(value);
    }
  }, [value, key, setItem]);

  useEffect(() => {
    window.addEventListener("storage", handleStorageEvent);

    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [handleStorageEvent]);

  return [value, setValue];
}
