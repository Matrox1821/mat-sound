import { toast, ToastOptions } from "react-toastify";

export function useToast() {
  const success = (message: string, options?: ToastOptions) => toast.success(message, options);
  const error = (message: string, options?: ToastOptions) => toast.error(message, options);
  const info = (message: string, options?: ToastOptions) => toast.info(message, options);

  return { success, error, info };
}
