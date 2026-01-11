import { z } from "zod";

export const SigninFormSchema = z.object({
  email: z.string().email({ message: "Introduce un correo electrónico válido." }).trim(),

  password: z.string().min(1, { message: "La contraseña es requerida." }),

  /* rememberMe: z.boolean().optional(), */
});

export const SignupFormSchema = z
  .object({
    username: z.string().min(3, { message: "El usuario debe tener al menos 4 caracteres." }).trim(),
    email: z.email({ message: "Email inválido." }).trim(),
    password: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres." })
      .regex(/[a-zA-Z]/, { message: "Debe contener al menos una letra." })
      .regex(/[0-9]/, { message: "Debe contener al menos un número." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"], // El error se marcará en este campo
  });

export type SigninFormValues = z.infer<typeof SigninFormSchema>;
export type SignupFormSchema = z.infer<typeof SignupFormSchema>;

export type FormSignupState = {
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  } | null;
  data?: {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  success?: boolean;
  message?: string;
};

export type FormSigninState = {
  errors?: {
    email?: string[];
    password?: string[];
  } | null;
  data?: {
    email?: string;
    password?: string;
  };
  success?: boolean;
  message?: string;
};
export type FormSignoutState = {
  success: boolean;
  message?: string | null;
  errors?: string[] | null;
};
