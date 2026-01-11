import { useState } from "react";
import { ToastOptions } from "react-toastify";
import { useToast } from "./useToast";

type ServerResponse = {
  success: boolean;
  errors?: { [key: string]: string }[];
};

interface UseCreateEntityOptions<T> {
  toFormData: (data: T) => FormData;
  serverAction: (initial: ServerResponse, form: FormData) => Promise<ServerResponse>;
  successMessage?: string;
  errorMessage?: string;
  toastOptions?: ToastOptions;
}

export function useCreateEntity<T>({
  toFormData,
  serverAction,
  successMessage = "Elemento creado con éxito",
  errorMessage = "Error al crear el elemento",
  toastOptions = {},
}: UseCreateEntityOptions<T>) {
  const { success: showSuccess, error: showError } = useToast();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }[]>([]);

  const createEntity = async (data: T) => {
    setLoading(true);
    setSuccess(false);
    setErrors([]);

    try {
      const form = toFormData(data);
      const result = await serverAction({ success: false, errors: [] }, form);

      if (result.success) {
        showSuccess(successMessage, toastOptions);
        setSuccess(true);
      } else {
        showError(errorMessage, toastOptions);
        setErrors(result.errors || []);
      }
    } catch (err) {
      console.error(err);
      showError("Error inesperado en la creación", toastOptions);
      setErrors([{ message: "Error inesperado" }]);
    } finally {
      setLoading(false);
    }
  };

  return { createEntity, loading, success, errors };
}
