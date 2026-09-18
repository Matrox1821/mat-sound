import { PrimeReactProvider } from "primereact/api";

import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primeicons/primeicons.css";
import { Header } from "@components/layout/header/index";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Aside } from "@components/layout/aside/index";
import { Suspense } from "react";

type LayoutSession = { user?: { username?: string | null } } | null;

async function AsideWithSession({ sessionPromise }: { sessionPromise: Promise<LayoutSession> }) {
  const session = await sessionPromise;
  return <Aside username={session?.user?.username} />;
}

async function HeaderWithSession({ sessionPromise }: { sessionPromise: Promise<LayoutSession> }) {
  const session = await sessionPromise;
  return <Header initialSession={session} />;
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const sessionPromise = auth.api.getSession({
    headers: requestHeaders,
  });

  return (
    <PrimeReactProvider>
      <div className="md:!w-screen md:!h-screen flex relative" id="root">
        <Suspense
          fallback={<aside className="w-72 h-full shrink-0 hidden md:!block" aria-hidden />}
        >
          <AsideWithSession sessionPromise={sessionPromise} />
        </Suspense>
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden h-full focus:border-0 focus:outline-0 relative">
          <Suspense fallback={null}>
            <HeaderWithSession sessionPromise={sessionPromise} />
          </Suspense>
          {children}
        </main>
      </div>
    </PrimeReactProvider>
  );
}
