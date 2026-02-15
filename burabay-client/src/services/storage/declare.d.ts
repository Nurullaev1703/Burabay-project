export {};

declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        authTokenHandler?: {
          postMessage: (message: string) => void;
        };
      };
    };
  }
}
