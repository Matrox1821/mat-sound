import Link from "next/link";
import SigninForm from "./SigninForm";

export default async function SignInPage() {
  return (
    <section className="flex flex-col items-center gap-12 overflow-y-auto overflow-x-hidden md:bg-background md:transition-[heigth] md:duration-200">
      <SigninForm />

      <span>
        No tienes una cuenta?{" "}
        <Link href={"/signup"} className="underline text-accent-900/95">
          Regístrate
        </Link>
      </span>
    </section>
  );
}
