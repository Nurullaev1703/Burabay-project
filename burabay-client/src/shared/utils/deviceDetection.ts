import device from "current-device";

export const isIOS = (): boolean => {
  return device.ios();
};

export const isIPad = (): boolean => {
  return device.ipad();
};

export const isIPhone = (): boolean => {
  return device.iphone();
};

export const isMobile = (): boolean => {
  return device.mobile();
};

export const isTablet = (): boolean => {
  return device.tablet();
};

export const isDesktop = (): boolean => {
  return device.desktop();
};

export const isPWA = (): boolean => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
};

export const isIOSSafari = (): boolean => {
  const userAgent = window.navigator.userAgent;
  return (
    isIOS() && /Safari/.test(userAgent) && !/CriOS|FxiOS|OPiOS/.test(userAgent)
  );
};
