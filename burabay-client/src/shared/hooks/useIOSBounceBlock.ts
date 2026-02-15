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
        // Игнорируем элементы Google Maps и другие интерактивные карты
        if (
          element.classList.contains('map-container') ||
          element.getAttribute('data-allow-touch') === 'true' ||
          element.closest('[data-allow-touch="true"]') ||
          element.closest('.gm-style') // Google Maps контейнер
        ) {
          return; // Не блокируем touch события для карт
        }

        const hasScroll = element.scrollHeight > element.clientHeight;
        const isScrollable =
          window.getComputedStyle(element).overflowY === "scroll" ||
          window.getComputedStyle(element).overflowY === "auto";
        
        // Также проверяем горизонтальный скролл (для категорий и т.д.)
        const hasHorizontalScroll = element.scrollWidth > element.clientWidth;
        const isHorizontallyScrollable =
          window.getComputedStyle(element).overflowX === "scroll" ||
          window.getComputedStyle(element).overflowX === "auto";

        if ((hasScroll && isScrollable) || (hasHorizontalScroll && isHorizontallyScrollable)) {
          const scrollTop = element.scrollTop;
          const scrollHeight = element.scrollHeight;
          const clientHeight = element.clientHeight;
          const isAtTop = scrollTop === 0;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight;

          const touches = e.touches[0];
          const startY = (element as any)._startY || touches.clientY;
          const deltaY = touches.clientY - startY;

          // Для горизонтально скроллируемых элементов не блокируем горизонтальные жесты
          if (hasHorizontalScroll && isHorizontallyScrollable) {
            return; // Позволяем горизонтальный скролл
          }

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
        // Игнорируем элементы карт
        if (
          element.classList.contains('map-container') ||
          element.getAttribute('data-allow-touch') === 'true' ||
          element.closest('[data-allow-touch="true"]') ||
          element.closest('.gm-style')
        ) {
          return;
        }

        const hasScroll = element.scrollHeight > element.clientHeight;
        const isScrollable =
          window.getComputedStyle(element).overflowY === "scroll" ||
          window.getComputedStyle(element).overflowY === "auto";
        
        const hasHorizontalScroll = element.scrollWidth > element.clientWidth;
        const isHorizontallyScrollable =
          window.getComputedStyle(element).overflowX === "scroll" ||
          window.getComputedStyle(element).overflowX === "auto";

        if ((hasScroll && isScrollable) || (hasHorizontalScroll && isHorizontallyScrollable)) {
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
