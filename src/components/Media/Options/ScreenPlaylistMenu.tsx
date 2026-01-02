"use client";
import { MusicNote } from "@/components/UI/Icons/Playback/MusicNote";
import { Play } from "@/components/UI/Icons/Playback/Play";
import { RightMenuIcon } from "@/components/UI/Icons/Playback/RightMenu";
import { Lyrics as LyricIcon } from "@/components/UI/Icons/Playback/Lyrics";

import { useProgress } from "@/shared/client/hooks/player/useProgress";
import { parseLyricsToObject, rgbColor } from "@/shared/utils/helpers";
import { useUIStore } from "@/store/activeStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";
import { playerTrackProps } from "@/types/trackProps";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "primereact/sidebar";
import { Fragment, RefObject, useState } from "react";
function darkenRgba(rgba: string, amount = 0.3) {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);

  if (!match) return rgba;

  let [, r, g, b, a] = match;
  const factor = 1 - amount; // 0.2 = 20% más oscuro

  const nr = Math.max(0, Math.floor(Number(r) * factor));
  const ng = Math.max(0, Math.floor(Number(g) * factor));
  const nb = Math.max(0, Math.floor(Number(b) * factor));

  return `rgba(${nr}, ${ng}, ${nb}, ${a ?? 1})`;
}

export function desaturateRgba(rgba: string, amount = 0.2): string {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
  if (!match) return rgba;

  let [, r, g, b, a = "1"] = match;
  let [R, G, B] = [Number(r) / 255, Number(g) / 255, Number(b) / 255];

  // RGB → HSL
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case R:
        h = (G - B) / d + (G < B ? 6 : 0);
        break;
      case G:
        h = (B - R) / d + 2;
        break;
      case B:
        h = (R - G) / d + 4;
        break;
    }
    h /= 6;
  }

  // bajar saturación
  s = Math.max(0, s - amount);

  // HSL → RGB
  function hue2rgb(p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  let R2, G2, B2;

  if (s === 0) {
    R2 = G2 = B2 = l; // gris
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    R2 = hue2rgb(p, q, h + 1 / 3);
    G2 = hue2rgb(p, q, h);
    B2 = hue2rgb(p, q, h - 1 / 3);
  }

  return `rgba(${Math.round(R2 * 255)}, ${Math.round(G2 * 255)}, ${Math.round(B2 * 255)}, ${a})`;
}
export const ScreenPlaylistMenu = ({ audioRef }: { audioRef: RefObject<HTMLAudioElement> }) => {
  const [showQueue, setShowQueue] = useState(true);
  const [showRecomendations, setShowRecomendations] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  const { playerScreenIsActive, setPlayerScreenIsActive, setPlayerRightMenuIsActive } =
    useUIStore();
  const { history, currentTrack, queue, playingFrom, upcoming } = usePlayerStore();
  const { darkVibrant } = rgbColor(currentTrack?.cover.lg);
  const lyrics = parseLyricsToObject(currentTrack?.lyric || "");
  return (
    <div className="flex items-center gap-2 relative justify-center ">
      <button
        className={`p-2 flex items-center justify-center rounded-lg bg-background-700 h-8 w-8 cursor-pointer ${
          playerScreenIsActive ? "" : ""
        }`}
        onClick={() => {
          setPlayerScreenIsActive(!playerScreenIsActive);
          setPlayerRightMenuIsActive(false);
        }}
      >
        <i
          className={`!text-xl pi pi-angle-up transition-[rotate] duration-200 leading-0 pb-[1px] pr-[1px] ${
            playerScreenIsActive ? "rotate-180" : ""
          }`}
        />
      </button>
      <Sidebar
        visible={playerScreenIsActive}
        position="bottom"
        onHide={() => setPlayerScreenIsActive(false)}
        showCloseIcon={false}
        className="p-sidebar !h-[calc(100vh-96px)] !w-screen !bottom-[96px] !absolute !border-none [&>.p-sidebar-header]:!p-0 [&>.p-sidebar-content]:!overflow-y-hidden [&>.p-sidebar-content]:!p-0 !z-20 !p-0"
        style={{
          background: `linear-gradient(180deg,${desaturateRgba(
            darkenRgba(darkVibrant)
          )} 0%, rgb(0, 0, 0) 98%)`,
        }}
      >
        <header className="h-[116px] ml-12 flex justify-start items-center">
          <button
            className={`h-[44px] px-4 gap-3 flex items-center justify-center rounded-xl bg-background-400/30 text-sm font-semibold cursor-pointer hover:bg-background-200/30`}
            onClick={() => {
              setPlayerScreenIsActive(false);
            }}
          >
            <i className={`!text-lg pi pi-angle-up leading-0 pb-[1px] pr-[1px] rotate-180`} />
            Minimizar
          </button>
        </header>
        <section className="grid grid-cols-[minmax(285px,437px)_minmax(468px,1174px)] mt-12 mx-30 gap-18 ">
          <article className="flex-shrink-0 min-w-[285px] max-w-[46vw] flex flex-col items-center">
            <Link
              href={`/tracks/${currentTrack?.id}`}
              onClick={() => setPlayerScreenIsActive(false)}
            >
              <Image
                src={currentTrack?.cover.lg || ""}
                alt={currentTrack?.name || ""}
                width={1200}
                height={1200}
                className="rounded-lg"
              />
            </Link>

            <Link
              href={`/tracks/${currentTrack?.id}`}
              className="font-bold text-2xl mt-[38px] leading-6 text-content-950 pb-1"
              onClick={() => setPlayerScreenIsActive(false)}
            >
              {currentTrack?.name}
            </Link>
            <span className="flex text-[18px]">
              {currentTrack?.artists?.map((artist, i) => (
                <Fragment key={artist.id}>
                  <Link
                    href={`/artists/${artist.id}`}
                    className=""
                    onClick={() => setPlayerScreenIsActive(false)}
                  >
                    {artist.name}
                  </Link>
                  {currentTrack.artists!.length - 1 !== i && " • "}
                </Fragment>
              ))}
            </span>
          </article>
          <article className="flex-1 flex flex-col gap-5">
            <header className="flex gap-4 h-11 mb-5">
              <button
                className={`cursor-pointer flex gap-3 px-4 py-3 rounded-lg ${
                  showQueue ? "bg-content-900 text-background" : "hover:bg-background-400/30"
                }`}
                onClick={() => {
                  setShowQueue(true);
                  setShowRecomendations(false);
                  setShowLyrics(false);
                }}
              >
                <RightMenuIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">Reproducir cola</span>
              </button>
              <button
                className={`cursor-pointer flex gap-3 px-4 py-3 rounded-lg ${
                  showRecomendations
                    ? "bg-content-900 text-background"
                    : "hover:bg-background-400/30"
                }`}
                onClick={() => {
                  setShowQueue(false);
                  setShowRecomendations(true);
                  setShowLyrics(false);
                }}
              >
                <MusicNote className="w-5 h-5" />
                <span className="text-sm font-semibold">Canciones sugeridas</span>
              </button>
              <button
                className={`cursor-pointer flex gap-3 px-4 py-3 rounded-lg ${
                  showLyrics ? "bg-content-900 text-background" : "hover:bg-background-400/30"
                }`}
                onClick={() => {
                  setShowQueue(false);
                  setShowRecomendations(false);
                  setShowLyrics(true);
                }}
              >
                <LyricIcon className="w-7 h-7" />
                <span className="text-sm font-semibold">Letras</span>
              </button>
            </header>
            {currentTrack && showQueue && (
              <Queue
                currentTrack={currentTrack}
                history={history}
                playingFrom={playingFrom}
                queue={queue}
                upcoming={upcoming}
                setPlayerScreenIsActive={setPlayerScreenIsActive}
              />
            )}
            {currentTrack && showLyrics && <Lyrics lyrics={lyrics} audioRef={audioRef} />}
          </article>
        </section>
      </Sidebar>
    </div>
  );
};

const Queue = ({
  history,
  playingFrom,
  currentTrack,
  upcoming,
  queue,
  setPlayerScreenIsActive,
}: {
  history: playerTrackProps[];
  playingFrom: string;
  currentTrack: playerTrackProps;
  upcoming: playerTrackProps[];
  queue: playerTrackProps[];
  setPlayerScreenIsActive: (value: boolean) => void;
}) => {
  const newListQueue = queue;
  return (
    <section className="overflow-y-scroll h-[calc(100vh-344px)]  ">
      {history.length !== 0 && (
        <ul className="mb-8">
          {history.map((track) => (
            <li
              key={track.id}
              className="flex gap-4 hover:[&>button>.play]:!flex hover:[&>button>img]:!brightness-25 hover:bg-background-400/30 py-2 px-3 ml-[4px] rounded-xl"
            >
              <button className="relative h-12 w-12 flex items-center justify-center cursor-pointer ">
                <Image
                  src={track.cover.lg}
                  alt={track.name}
                  width={48}
                  height={48}
                  className="rounded-sm opacity-60 transition-[filter] duration-200"
                />
                <Play className="play absolute hidden z-50 opacity-95" />
              </button>
              <span className="flex flex-col h-full justify-evenly w-4/5 opacity-60">
                <span>
                  <Link
                    href={`/tracks/${track.id}`}
                    className="overflow-ellipsis overflow-x-hidden hover:underline w-auto font-semibold text-sm"
                  >
                    {track.name}
                  </Link>
                </span>

                {track.artists?.map((artist, i) => (
                  <span key={artist.id}>
                    <Link
                      href={`/artists/${artist.id}`}
                      onClick={() => setPlayerScreenIsActive(false)}
                      className="hover:underline overflow-ellipsis overflow-x-hidden text-background-400 font-semibold text-sm"
                    >
                      {artist.name} {track.artists!.length - 1 < i ? " • " : ""}
                    </Link>
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      )}
      <span className={`text-[12px] text-background-200 uppercase font-semibold`}>
        Reproduciendo desde: {playingFrom}
      </span>
      {currentTrack && (
        <div
          className={`flex gap-4 hover:[&>button>.play]:!flex hover:[&>button>img]:!brightness-45 hover:bg-background-400/30 py-2 px-3 mt-4 rounded-xl ${"mb-8"}`}
        >
          <button className="relative h-12 w-12 flex items-center justify-center cursor-pointer ">
            <Image
              src={currentTrack.cover.lg}
              alt={currentTrack.name}
              width={48}
              height={48}
              className="rounded-sm transition-[filter] duration-200"
            />
            <Play className="play absolute hidden z-50 " />
          </button>
          <span className="flex flex-col h-full justify-evenly w-4/5 ">
            <span>
              <Link
                href={`/tracks/${currentTrack.id}`}
                className="w-2/3 overflow-ellipsis overflow-x-hidden hover:underline text-accent-900 font-semibold text-sm"
                onClick={() => setPlayerScreenIsActive(false)}
              >
                {currentTrack.name}
              </Link>
            </span>

            {currentTrack.artists?.map((artist, i) => (
              <span key={artist.id}>
                <Link
                  href={`/artists/${artist.id}`}
                  className="hover:underline w-1/3 overflow-ellipsis overflow-x-hidden text-background-200 font-semibold text-sm"
                  onClick={() => setPlayerScreenIsActive(false)}
                >
                  {artist.name} {currentTrack.artists!.length - 1 < i ? " • " : ""}
                </Link>
              </span>
            ))}
          </span>
        </div>
      )}
      {newListQueue.length > 1 && (
        <span className="text-[12px] text-background-200 uppercase font-semibold">
          A continuación:
        </span>
      )}
      {newListQueue.slice(1, -1).length !== 0 && (
        <ul>
          {newListQueue.slice(1, -1).map((track) => (
            <li
              key={track.id}
              className="flex gap-4 hover:[&>button>.play]:!flex hover:[&>button>img]:!brightness-45 hover:bg-background-400/30 py-2 px-3  rounded-xl"
            >
              <button className="relative h-12 w-12 flex items-center justify-center cursor-pointer ">
                <Image
                  src={track.cover.lg}
                  alt={track.name}
                  width={48}
                  height={48}
                  className="rounded-sm transition-[filter] duration-200"
                />
                <Play className="play absolute hidden z-50 " />
              </button>
              <span className="flex flex-col h-full justify-evenly w-4/5 ">
                <span>
                  <Link
                    href={`/tracks/${track.id}`}
                    className="w-2/3 overflow-ellipsis overflow-x-hidden hover:underline font-semibold text-sm"
                    onClick={() => setPlayerScreenIsActive(false)}
                  >
                    {track.name}
                  </Link>
                </span>

                {track.artists?.map((artist, i) => (
                  <span key={artist.id}>
                    <Link
                      href={`/artists/${artist.id}`}
                      className="hover:underline w-1/3 overflow-ellipsis overflow-x-hidden text-background-300 text-sm font-semibold"
                      onClick={() => setPlayerScreenIsActive(false)}
                    >
                      {artist.name} {track.artists!.length - 1 < i ? " • " : ""}
                    </Link>
                  </span>
                ))}
              </span>
            </li>
          ))}
          <li className="p-2 h-20"></li>
        </ul>
      )}
      {upcoming.length !== 0 && (
        <span className="text-[12px] text-background-200 uppercase font-semibold">
          A continuación:
        </span>
      )}
      {upcoming.length !== 0 && (
        <ul>
          {upcoming.map((track) => (
            <li
              key={track.id}
              className="flex gap-4 hover:[&>button>.play]:!flex hover:[&>button>img]:!brightness-25 hover:bg-background-800 p-2 rounded-xl"
            >
              <button className="relative h-12 w-12 flex items-center justify-center cursor-pointer ">
                <Image
                  src={track.cover.lg}
                  alt={track.name}
                  width={48}
                  height={48}
                  className="rounded-sm "
                />
                <Play className="play absolute hidden z-50 " />
              </button>
              <span className="flex flex-col h-full justify-evenly w-4/5 ">
                <span>
                  <Link
                    href={`/tracks/${track.id}`}
                    className="w-2/3 overflow-ellipsis overflow-x-hidden hover:underline font-semibold text-sm"
                    onClick={() => setPlayerScreenIsActive(false)}
                  >
                    {track.name}
                  </Link>
                </span>

                {track.artists?.map((artist, i) => (
                  <span key={artist.id}>
                    <Link
                      href={`/artists/${artist.id}`}
                      className="hover:underline w-1/3 overflow-ellipsis overflow-x-hidden text-background-300 font-semibold text-sm"
                      onClick={() => setPlayerScreenIsActive(false)}
                    >
                      {artist.name} {track.artists!.length - 1 < i ? " • " : ""}
                    </Link>
                  </span>
                ))}
              </span>
            </li>
          ))}
          <li className="p-2 h-20"></li>
        </ul>
      )}
    </section>
  );
};

const Lyrics = ({
  lyrics,
  audioRef,
}: {
  lyrics: { end?: number; start: number; lyric: string }[];
  audioRef: RefObject<HTMLAudioElement>;
}) => {
  const { currentTime, setCurrentTime } = useProgress(audioRef);
  const { play, pause } = usePlaybackStore();
  return (
    <section className="overflow-y-scroll h-[calc(100vh-344px)]">
      <ul className="mb-8 flex flex-col gap-10">
        {lyrics.map(({ end, start, lyric }, i) => {
          const isCurrent = currentTime > start && end && currentTime < end;
          return (
            <li
              className={`flex gap-4 font-bold text-3xl py-2 px-3 ml-[4px] rounded-xl transition-colors duration-400 ${
                isCurrent ? "text-content-950/80" : "text-background-500"
              }`}
              key={`${i}`}
            >
              <button
                className="cursor-pointer"
                onClick={() => {
                  pause();
                  audioRef.current.currentTime = start;
                  setCurrentTime(start);
                  play();
                }}
              >
                {lyric.replace(/\\"/g, '"').replace(/\\n/g, "\n")}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
