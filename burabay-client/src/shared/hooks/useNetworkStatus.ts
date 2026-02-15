import { useEffect, useState } from "react";

// Hook для отслеживания статуса сети
export const useNetworkStatus = (): boolean => {
  const isBrowser = typeof window !== "undefined" && typeof navigator !== "undefined";
  const [isOnline, setIsOnline] = useState<boolean>(isBrowser ? navigator.onLine : true);

  useEffect(() => {
    if (!isBrowser) return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isBrowser]);

  return isOnline;
};
