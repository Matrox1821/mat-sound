"use client";
import { Send as SendIcon } from "@/components/ui/icons/Send";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { GET_URL } from "@/shared/utils/constants";
import Link from "next/link";
import { Dialog } from "primereact/dialog";
import { useState } from "react";

const socials = [
  {
    href: (link: string) => `whatsapp://send?text=${link}`,
    label: (label: string) => `${label}`,
    to: "whatsapp",
    Icon: <i className="pi pi-whatsapp !text-4xl text-green-400" />,
  },
  {
    href: (link: string) => `https://x.com/intent/tweet?text=${link}`,
    label: (label: string) => `${label}`,
    to: "x",
    Icon: <i className="pi pi-twitter !text-4xl" />,
  },
  {
    href: (link: string) => `https://www.facebook.com/sharer/sharer.php?&quote=${link}`,
    label: (label: string) => `${label}`,
    to: "facebook",
    Icon: <i className="pi pi-facebook !text-4xl text-blue-500" />,
  },
];

export function Send({
  link,
  title,
  className,
  svgClassName,
}: {
  link: string;
  title?: string;
  className?: string;
  svgClassName?: string;
}) {
  const [visible, setVisible] = useState(false);
  const { message } = useToast();

  return (
    <div>
      <button
        onClick={() => setVisible(true)}
        className={`!border-none !text-white/90 cursor-pointer flex flex-col items-center justify-center rounded-full ${className}`}
      >
        <SendIcon className={`h-5 ${svgClassName}`} />
      </button>
      <Dialog
        className="!border-0"
        visible={visible}
        modal
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        content={() => (
          <div
            className="flex flex-col p-3 bg-background-950 items-end"
            style={{
              borderRadius: "12px",
            }}
          >
            <div className="flex items-center justify-between w-full pb-6">
              <h3 className="pl-2">Compartir</h3>
              <button
                type="button"
                onClick={() => setVisible(false)}
                className="text-primary-50 bg-background rounded-full p-1 h-8 w-8 flex items-center justify-center cursor-pointer hover:bg-background-800/60"
              >
                <i className="pi pi-times"></i>
              </button>
            </div>
            <div className="px-4 py-2 flex flex-col gap-4">
              <span className="border border-accent-50/30  py-4 px-4 rounded-2xl flex items-center gap-2 ">
                <span className="w-[30ch] overflow-hidden text-ellipsis whitespace-nowrap ">
                  {GET_URL + link}
                </span>
                <button
                  className="bg-accent-950 text-background p-1 rounded-md cursor-pointer hover:bg-accent-950/90"
                  onClick={async () => {
                    await navigator.clipboard.writeText(GET_URL + link);
                    message("Copiado al portapapeles");
                    setVisible(false);
                  }}
                >
                  Copiar
                </button>
              </span>
              <nav className="flex gap-3">
                {socials.map(({ href, to, Icon }) => (
                  <Link
                    href={`${href(GET_URL + link)} ${title}`}
                    target="_blank"
                    key={to}
                    onClick={() => setVisible(false)}
                  >
                    {Icon}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      ></Dialog>
    </div>
  );
}
