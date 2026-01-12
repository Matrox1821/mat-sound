import { toast, ExternalToast } from "sonner";

interface CustomToastOptions extends ExternalToast {
  className?: string;
}

export const useToast = () => {
  const baseContainer =
    "flex items-center gap-3 !h-6 rounded-xl border shadow-lg !w-auto [&_[data-title]]:!max-w-[300px] [&_[data-title]]:!overflow-hidden [&_[data-title]]:!text-ellipsis [&_[data-title]]:!whitespace-nowrap";

  const createToast = (
    type: "success" | "error" | "info" | "message",
    msg: string,
    options?: CustomToastOptions
  ) => {
    const styles = {
      success: "bg-background-950 border-green-500/50 text-green-400",
      error: "bg-background-950 border-red-500/50 text-red-400",
      info: "bg-background-950 border-background-700 text-white",
      message: "bg-background-900 border-background-700 text-background-200",
    };

    const icons = {
      success: <i className={`pi pi-check-circle`} />,
      error: <i className={`pi pi-exclamation-circle `} />,
      info: <i className={`pi pi-info-circle `} />,
      message: <i className={`pi pi-bell `} />,
    };

    return toast[type](msg, {
      ...options,
      className: `${baseContainer} ${styles[type]} ${options?.className || ""}`,
      icon: icons[type],
    });
  };

  return {
    success: (msg: string, opts?: CustomToastOptions) => createToast("success", msg, opts),
    error: (msg: string, opts?: CustomToastOptions) => createToast("error", msg, opts),
    info: (msg: string, opts?: CustomToastOptions) => createToast("info", msg, opts),
    default: (msg: string, opts?: CustomToastOptions) => createToast("message", msg, opts),
    loading: (msg: string, opts?: CustomToastOptions) =>
      toast.loading(msg, {
        ...opts,
        className: `${baseContainer} bg-background-950 border-background-700 text-white ${
          opts?.className || ""
        }`,
      }),
    dismiss: toast.dismiss,
  };
};
