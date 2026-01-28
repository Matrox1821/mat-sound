import Link from "next/link";
import SignupForm from "./SignupForm";

export default async function SignupPage() {
  return (
    <section className="flex flex-col items-center gap-12 w-full overflow-y-auto overflow-x-hidden md:bg-background md:transition-[heigth] md:duration-200">
      <SignupForm />

      <span>
        Ya tienes una cuenta?{" "}
        <Link href={"/signin"} className="underline text-accent-900/95">
          Inicia Sesión
        </Link>
      </span>
    </section>
  );
}
