"use client";
import { signoutFormValidation } from "@/actions/auth";
import { User as UserIcon } from "@/components/ui/icons/User";
import { FormSignoutState } from "@/shared/utils/schemas/validations";
import Link from "next/link";
import { OverlayPanel } from "primereact/overlaypanel";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

const initialState: FormSignoutState = {
  success: false,
  message: undefined,
  errors: null,
};
export default function User({ initialSession }: { initialSession: any }) {
  const [state, formAction] = useActionState(signoutFormValidation, initialState);
  const op = useRef<OverlayPanel>(null);
  const options = [
    { label: "Perfil", href: `/user/${initialSession.user.username}` },
    { label: "Configuración", href: "`/user/settings`" },
  ];

  useEffect(() => {
    if (state.success) {
      toast("Has cerrado tu sesión");
      window.location.href = "/";
    }
  }, [state]);
  return (
    <>
      <button
        className="w-10 h-10 !flex !items-center !justify-center !p-0 !rounded-full !bg-background-800 cursor-pointer"
        onClick={(e) => op.current?.toggle(e)}
      >
        <UserIcon className="text-background-50 " />
      </button>
      <OverlayPanel
        ref={op}
        className="after:!border-b-background !w-[200px] !shadow-sm before:!border-b-background-800 !bg-background !border-background-800  [&>.p-overlaypanel-content]:!flex [&>.p-overlaypanel-content]:!flex-col [&>.p-overlaypanel-content]:!items-center [&>.p-overlaypanel-content]:!gap-1 [&>.p-overlaypanel-content]:!p-1 !rounded-lg"
      >
        {options.map((option) => (
          <Link
            href={option.href}
            key={option.label}
            className="w-full hover:bg-background-900 py-2 px-3 rounded-sm"
            onClick={(e) => op.current?.toggle(e)}
          >
            {option.label}
          </Link>
        ))}
        <form className="w-full" action={formAction}>
          <button
            className="text-red-500 w-full hover:bg-background-900 py-2 px-3 rounded-sm text-start cursor-pointer"
            type="submit"
          >
            Cerrar sesión
          </button>
        </form>
      </OverlayPanel>
    </>
  );
}
