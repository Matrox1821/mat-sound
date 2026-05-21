"use client";
import { useState } from "react";
import { ToasterProps } from "sonner";
import { useToast } from "./useToast";

type ServerResponse<D = unknown> = {
  success: boolean;
  errors?: { [key: string]: string }[];
  data?: D;
};

interface UseCreateEntityOptions<T, D = unknown> {
  toFormData: (data: T) => FormData;
  serverAction: (initial: ServerResponse<D>, form: FormData) => Promise<ServerResponse<D>>;
  successMessage?: string;
  errorMessage?: string;
  toastOptions?: ToasterProps;
}

export function useCreateEntity<T, D = unknown>({
  toFormData,
  serverAction,
  successMessage = "Elemento creado con éxito",
  errorMessage = "Error al crear el elemento",
}: UseCreateEntityOptions<T, D>) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<D | null>(null);
  const { success: successToast, error } = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }[]>([]);

  const createEntity = async (entity: T) => {
    setLoading(true);
    setSuccess(false);
    setErrors([]);
    setData(null);

    try {
      const form = toFormData(entity);
      const result = await serverAction({ success: false, errors: [] }, form);

      if (result.success) {
        successToast(successMessage);
        setSuccess(true);
        setData(result.data ?? null);
      } else {
        error(errorMessage);
        setErrors(result.errors || []);
      }
    } catch (err) {
      console.error(err);
      error("Error inesperado en la creación");
      setErrors([{ message: "Error inesperado" }]);
    } finally {
      setLoading(false);
    }
  };

  return { createEntity, loading, success, errors, data };
}
