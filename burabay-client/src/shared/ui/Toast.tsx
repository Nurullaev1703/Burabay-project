import { FC, useEffect, useState } from "react";

export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose?: () => void;
}

export const Toast: FC<ToastProps> = ({
  message,
  type,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const iconColor = type === "success" ? "text-[#39B56B]" : "text-[#FF4545]";
  const textColor = type === "success" ? "text-[#39B56B]" : "text-[#FF4545]";
  const icon = type === "success" ? "✓" : "✕";

  return (
    <div className="fixed top-8 right-8 z-[9999] animate-fade-in">
      <div
        className={`bg-white border-2 ${type === "success" ? "border-[#39B56B]" : "border-[#FF4545]"} px-6 py-4 rounded-[16px] shadow-lg flex items-center gap-3 max-w-[400px]`}
      >
        <span className={`text-2xl font-bold flex-shrink-0 ${iconColor}`}>
          {icon}
        </span>
        <span className={`font-roboto text-[14px] leading-[20px] ${textColor} line-clamp-3`}>
          {message}
        </span>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export interface ToastRef {
  showToast: (message: string, type: ToastType) => void;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: ToastType }>
  >([]);

  const showToast = (message: string, type: ToastType = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    showToast,
    removeToast,
  };
};

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  onRemove: (id: string) => void;
}

export const ToastContainer: FC<ToastContainerProps> = ({
  toasts,
  onRemove,
}) => {
  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </>
  );
};
