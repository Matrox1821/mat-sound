import Image from "next/image";

export default async function Background({
  image,
  children,
  className,
  background,
}: {
  image?: string;
  children: React.ReactNode;
  className?: string;
  background?: string;
}) {
  return (
    <div className={`w-full h-full ${"bg-" + background || "bg-background-950"}`}>
      <div
        className={`absolute w-full h-5/6 after:content-[''] after:w-full after:h-full after:absolute after:left-0 after:top-0 after:bg-linear-to-t ${
          "after:from-" + background || "after:from-background-950"
        } after:to-transparent`}
      >
        <Image
          src={image || ""}
          alt="cover blured"
          width={3000}
          height={2000}
          className="z-0 w-full h-4/6 absolute object-cover blur-3xl opacity-50 "
        />
      </div>
      <section className={`relative p-8 flex gap-8 ${className}`}>{children}</section>
    </div>
  );
}
