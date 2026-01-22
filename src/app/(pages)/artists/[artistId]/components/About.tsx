"use client";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import Link from "next/link";
import { ArtistServer } from "@/types/artist.types";
import { SafeImage } from "@/components/ui/images/SafeImage";

type SocialKey = keyof typeof SOCIAL_ICONS;

const SOCIAL_ICONS = {
  x: "pi-twitter",
  instagram: "pi-instagram",
  facebook: "pi-facebook",
  default: "pi-external-link",
} as const;

function sortSocials(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).sort(([a], [b]) => {
      const aHasIcon = a in SOCIAL_ICONS;
      const bHasIcon = b in SOCIAL_ICONS;

      if (aHasIcon && bHasIcon) {
        return a.localeCompare(b);
      }

      if (aHasIcon && !bHasIcon) return -1;
      if (!aHasIcon && bHasIcon) return 1;

      return a.localeCompare(b);
    }),
  );
}

export default function About({ artist }: { artist: ArtistServer | null }) {
  const [visible, setVisible] = useState(false);
  if (!artist) return;
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Acerca de</h2>
      <button
        className="flex-none w-3/5 h-[516px] relative rounded-xl after:absolute after:content-[''] after:w-full after:h-[101%] after:bg-linear-to-t after:from-background after:to-60% after:to-background/10 after:left-0 after:top-0 after:rounded-xl after:z-10 cursor-pointer hover:scale-101 transition-[scale] duration-400"
        onClick={() => setVisible(true)}
      >
        <SafeImage
          src={artist.avatar && artist.avatar.lg}
          alt={artist.name}
          height={1200}
          width={1200}
          className="!object-cover !rounded-xl !w-full !h-[516px]"
        />
        <div className="absolute w-full h-full top-0 z-20 p-6 flex items-end">
          <span className="gap-4 bottom-4 flex flex-col items-start">
            <h3 className="text-content-950 font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
              {artist.listeners} oyentes mensuales
            </h3>
            <p className="text-background-300 font-normal w-full overflow-hidden text-ellipsis whitespace-nowrap line-clamp-3 text-start">
              {artist.description}
            </p>
          </span>
        </div>
      </button>
      <Dialog
        className="!border-0 !pt-0"
        visible={visible}
        closable
        modal
        dismissableMask
        closeOnEscape
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        content={() => (
          <div className="rounded-2xl overflow-hidden">
            <section
              className="flex flex-column gap-4 bg-background-950 relative"
              style={{
                borderRadius: "12px",
              }}
            >
              <button
                className="z-10 absolute right-5 top-4 rounded-full bg-content-950/10 p-1 h-8 w-8 flex items-center justify-center cursor-pointer hover:scale-105 transition-[scale] duration-200"
                onClick={() => setVisible(false)}
              >
                <i className="pi pi-times !font-extralight text-content-950/60" />
              </button>
              <section className="w-[900px] h-[800px] relative rounded-xl overflow-y-scroll">
                <figure className="w-full h-[432px] flex justify-center bg-black/90 rounded-tl-xl">
                  <SafeImage
                    src={artist.covers.length > 0 ? artist.covers![0] : null}
                    alt={artist.name}
                    width={516}
                    height={516}
                    className="!object-contain"
                  />
                </figure>
                <div className="flex p-12 gap-12">
                  <div className="flex flex-col gap-6">
                    <ul className="flex flex-col gap-4 pb-6">
                      <li className="flex flex-col">
                        <span className="text-4xl font-semibold">
                          {artist.followers.toLocaleString()}
                        </span>
                        <span className="text-sm text-background-200">Seguidores</span>
                      </li>
                      <li className="flex flex-col">
                        <span className="text-4xl font-semibold">
                          {artist.listeners.toLocaleString()}
                        </span>
                        <span className="text-sm text-background-200">Oyentes mensuales</span>
                      </li>
                    </ul>
                    <ul className="flex flex-col gap-3 pb-6">
                      {artist.regionalListeners &&
                        Object.entries(artist.regionalListeners).map(
                          ([key, value]: [string, any]) => {
                            const reproductions = Number(value).toLocaleString();
                            return (
                              <li className="flex flex-col" key={key}>
                                <span className="text-sm font-semibold">{key}</span>
                                <span className="text-sm text-background-200">
                                  {reproductions} oyentes
                                </span>
                              </li>
                            );
                          },
                        )}
                    </ul>
                    <ul className="flex flex-col gap-4">
                      {artist.socials &&
                        Object.entries(sortSocials(artist.socials)).map(
                          ([key, value]: [string, any]) => {
                            const icon = SOCIAL_ICONS[key as SocialKey] ?? SOCIAL_ICONS.default;
                            return (
                              <Link
                                className="flex gap-2 items-center hover:[&>span]:underline"
                                key={key}
                                href={value}
                                target="_blank"
                              >
                                <i className={`pi ${icon} !text-xl`} />
                                <span className="text-sm font-semibold">{key}</span>
                              </Link>
                            );
                          },
                        )}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-8">
                    <p className="text-background-200">{artist.description}</p>
                    <span className="flex gap-3 items-center">
                      <SafeImage
                        className="!rounded-full !w-8 !h-8"
                        src={artist.avatar && artist.avatar.sm}
                        alt={artist.name}
                        width={16}
                        height={16}
                      />
                      <span className="text-background-200 text-sm">
                        Publicado por {artist.name}
                      </span>
                    </span>
                  </div>
                </div>
              </section>
            </section>
          </div>
        )}
      ></Dialog>
    </div>
  );
}
