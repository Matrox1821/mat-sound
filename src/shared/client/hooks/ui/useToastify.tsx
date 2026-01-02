import { toast, ToastOptions } from "react-toastify";

export function useToastify(defaultOptions?: ToastOptions) {
  const showSuccess = (message: string, options?: ToastOptions) =>
    toast.success(message, { ...defaultOptions, ...options });

  const showError = (message: string, options?: ToastOptions) =>
    toast.error(message, { ...defaultOptions, ...options });

  const showInfo = (message: string, options?: ToastOptions) =>
    toast.info(message, { ...defaultOptions, ...options });

  const showWarning = (message: string, options?: ToastOptions) =>
    toast.warning(message, { ...defaultOptions, ...options });

  return { showSuccess, showError, showInfo, showWarning };
}
