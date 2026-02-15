import { useEffect } from "react";
import { isIOS } from "../utils/deviceDetection";

export const useIOSViewportHeight = () => {
  useEffect(() => {
    if (!isIOS()) {
      return;
    }

    const setRealViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--real-vh", `${vh}px`);
    };

    setRealViewportHeight();

    window.addEventListener("resize", setRealViewportHeight);
    window.addEventListener("orientationchange", setRealViewportHeight);

    const intervalId = setInterval(setRealViewportHeight, 100);
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, 2000);

    return () => {
      window.removeEventListener("resize", setRealViewportHeight);
      window.removeEventListener("orientationchange", setRealViewportHeight);
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);
};
