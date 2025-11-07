import { useEffect } from "react";
import { isIOS } from "../utils/deviceDetection";

export const useIOSBounceBlock = () => {
  useEffect(() => {
    if (!isIOS()) {
      return;
    }

    document.documentElement.classList.add("ios-device");
    document.body.classList.add("ios-bounce-blocked");

    const preventBodyScroll = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      let element: HTMLElement | null = target;

      while (element && element !== document.body) {
        const hasScroll = element.scrollHeight > element.clientHeight;
        const isScrollable =
          window.getComputedStyle(element).overflowY === "scroll" ||
          window.getComputedStyle(element).overflowY === "auto";

        if (hasScroll && isScrollable) {
          const scrollTop = element.scrollTop;
          const scrollHeight = element.scrollHeight;
          const clientHeight = element.clientHeight;
          const isAtTop = scrollTop === 0;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight;

          const touches = e.touches[0];
          const startY = (element as any)._startY || touches.clientY;
          const deltaY = touches.clientY - startY;

          if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
            e.preventDefault();
          }
          return;
        }
        element = element.parentElement;
      }

      e.preventDefault();
    };

    const saveTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      let element: HTMLElement | null = target;

      while (element && element !== document.body) {
        const hasScroll = element.scrollHeight > element.clientHeight;
        const isScrollable =
          window.getComputedStyle(element).overflowY === "scroll" ||
          window.getComputedStyle(element).overflowY === "auto";

        if (hasScroll && isScrollable) {
          (element as any)._startY = e.touches[0].clientY;
          return;
        }
        element = element.parentElement;
      }
    };

    document.body.addEventListener("touchstart", saveTouchStart, {
      passive: true,
    });
    document.body.addEventListener("touchmove", preventBodyScroll, {
      passive: false,
    });

    return () => {
      document.documentElement.classList.remove("ios-device");
      document.body.classList.remove("ios-bounce-blocked");
      document.body.removeEventListener("touchstart", saveTouchStart);
      document.body.removeEventListener("touchmove", preventBodyScroll);
    };
  }, []);
};
