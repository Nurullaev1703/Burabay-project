import { useEffect, useRef, useState } from "react";

interface Options {
  pingUrl?: string;
  interval?: number; // ms
  timeout?: number; // ms
}

// Hook для проверки доступности сервера (легкий ping-запрос)
export const useServerStatus = (opts: Options = {}) => {
  const { pingUrl = "/api/health", interval = 15000, timeout = 5000 } = opts;
  const [serverAvailable, setServerAvailable] = useState<boolean>(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const check = async () => {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const res = await fetch(pingUrl, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
          credentials: "same-origin",
        });
        clearTimeout(id);
        if (!mounted.current) return;
        // consider 2xx and 3xx as OK
        setServerAvailable(res.ok);
      } catch (e) {
        if (!mounted.current) return;
        setServerAvailable(false);
      }
    };

    // initial check
    check();
    const timer = setInterval(check, interval);

    return () => {
      mounted.current = false;
      clearInterval(timer);
    };
  }, [pingUrl, interval, timeout]);

  return serverAvailable;
};
