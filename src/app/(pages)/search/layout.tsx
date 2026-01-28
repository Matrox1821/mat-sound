import { Nav } from "./components/Nav";

export default async function SearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <article className="w-full z-20 h-full flex flex-col relative md:pt-32 px-12 md:bg-background md:transition-[heigth] md:duration-200 focus-visible:outline-0">
      <Nav />
      <hr className="border-1 border-t-0 border-background-800 my-4" />
      {children}
    </article>
  );
}
