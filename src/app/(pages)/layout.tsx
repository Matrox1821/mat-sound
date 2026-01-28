import { PrimeReactProvider } from "primereact/api";

import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primeicons/primeicons.css";
import { Header } from "../../../src/components/layout/header/index";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { userApi } from "@/queryFn/client/userApi";
import { Aside } from "../../../src/components/layout/aside/index";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const promise = userApi.getCollection(session?.user.id || "");

  return (
    <PrimeReactProvider>
      <div className="md:!w-screen md:!h-screen flex relative" id="root">
        <Aside userCollectionPromise={promise} />
        <main className="w-full overflow-y-auto overflow-x-hidden h-full focus:border-0 focus:outline-0 relative">
          <Header initialSession={session} />
          {children}
        </main>
      </div>
    </PrimeReactProvider>
  );
}
