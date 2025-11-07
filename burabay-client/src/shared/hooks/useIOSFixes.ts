import { useIOSBounceBlock } from "./useIOSBounceBlock";
import { useIOSViewportHeight } from "./useIOSViewportHeight";

export const useIOSFixes = () => {
  useIOSBounceBlock();
  useIOSViewportHeight();
};
