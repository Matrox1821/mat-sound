import { ToastContainer } from "react-toastify";
import { PrimeReactProvider } from "primereact/api";

import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primeicons/primeicons.css";
import Header from "@/components/Layout/Header";
import Aside from "@/components/Layout/Aside";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <PrimeReactProvider>
      <div className="md:!w-screen md:!h-screen flex relative" id="root">
        <Aside />
        <main className="w-full overflow-y-auto overflow-x-hidden h-full focus:border-0 focus:outline-0 relative">
          <Header initialSession={session} />
          {children}
        </main>
        <ToastContainer position="bottom-right" draggable theme="dark" />
      </div>
    </PrimeReactProvider>
  );
}
