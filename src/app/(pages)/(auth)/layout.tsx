export default async function SearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <article className="w-full h-full flex flex-col relative bg-background items-center justify-center">
      {children}
    </article>
  );
}
