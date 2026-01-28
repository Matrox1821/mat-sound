"use client";
import { MusicNote } from "@components/ui/icons/playback/MusicNote";
import { Play } from "@components/ui/icons/playback/Play";
import { RightMenuIcon } from "@components/ui/icons/playback/RightMenu";
import { Lyrics as LyricIcon } from "@components/ui/icons/playback/Lyrics";
import { useProgress } from "@/shared/client/hooks/player/useProgress";
import { parseLyricsToObject } from "@/shared/utils/helpers";
import { useUIStore } from "@/store/activeStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";
import Link from "next/link";
import { Sidebar } from "primereact/sidebar";
import { Fragment, RefObject, useState } from "react";
import { SafeImage } from "@components/ui/images/SafeImage";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { Pause } from "@components/ui/icons/playback/Pause";
import { playerTrackProps } from "@shared-types/track.types";

export const ScreenPlaylistMenu = ({ audioRef }: { audioRef: RefObject<HTMLAudioElement> }) => {
  const [showQueue, setShowQueue] = useState(true);
  const [showRecomendations, setShowRecomendations] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const { error } = useToast();

  const { playerScreenIsActive, setPlayerScreenIsActive, setPlayerRightMenuIsActive } =
    useUIStore();

  const { isPlaying, play, pause } = usePlaybackStore((state) => state);

  const { history, currentTrack, queue, playingFrom, upcoming, setPlayingFrom } = usePlayerStore();
  const lyrics = parseLyricsToObject(currentTrack?.lyrics || "");

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    track: playerTrackProps,
    from?: "history" | "queue" | "upcoming" | "recomendations",
  ) => {
    e.stopPropagation();
    e.preventDefault();

    // 1. Validación básica
    if (!track.song) return;

    // 2. Lógica de Toggle (Play/Pause)
    if (track.id === currentTrack?.id) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
      return;
    }

    // 3. Lógica de Movimiento de Estados
    let newHistory = [...history];
    let newQueue = [...queue];
    let newUpcoming = [...upcoming];

    switch (from) {
      case "history":
        // Si clickeo en el historial (ej: el 3)
        // h:[1,2,3,4] -> ct:3, q:[3,4,5,6...], h:[1,2]
        const hIndex = history.findIndex((t) => t.id === track.id);
        if (hIndex !== -1) {
          newHistory = history.slice(0, hIndex);
          // La nueva queue es lo que sacamos de history + la queue vieja
          newQueue = [...history.slice(hIndex), ...queue];
        }
        break;

      case "queue":
        // Si clickeo en la cola (ej: el 7)
        // q:[5,6,7,8] -> ct:7, q:[7,8], h:[...prev, 5,6]
        const qIndex = queue.findIndex((t) => t.id === track.id);
        if (qIndex !== -1) {
          const passedToHistory = queue.slice(0, qIndex);
          newHistory = [...history, ...passedToHistory];
          newQueue = queue.slice(qIndex);
        }
        break;

      case "upcoming":
        // Si clickeo en upcoming (ej: el 12)
        // Todo lo anterior (history + queue) pasa al history
        const uIndex = upcoming.findIndex((t) => t.id === track.id);
        if (uIndex !== -1) {
          newHistory = [...history, ...queue, ...upcoming.slice(0, uIndex)];
          newQueue = [upcoming[uIndex]];
          newUpcoming = upcoming.slice(uIndex + 1);
        }
        break;

      case "recomendations":
        // Reset total y nueva lista
        // En este caso 'track' es la primera y 'upcoming' serían las demás
        newHistory = [];
        newQueue = [track];
        // Aquí asumo que si viene de recomendaciones, querrás setear las demás como upcoming
        // Si tienes una lista de recomendaciones completa, pásala aquí
        newUpcoming = [];
        setPlayingFrom("Recommendations");
        break;
    }

    // 4. Aplicar cambios al store
    // Usamos setTrack para actualizar currentTrack y la Queue reconstruida
    // Nota: Tu setTrack actual hace un slice interno, quizás prefieras
    // una acción custom o ajustar los estados manualmente con 'set'
    usePlayerStore.setState({
      history: newHistory,
      queue: newQueue,
      currentTrack: track,
      upcoming: newUpcoming,
    });

    play();
  };
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
        className="p-sidebar !h-[calc(100vh-96px)] !w-screen !bottom-[96px] !absolute !border-none [&>.p-sidebar-header]:!p-0 [&>.p-sidebar-content]:!overflow-y-hidden [&>.p-sidebar-content]:!p-0 !z-20 !p-0 !bg-black"
        style={{
          position: "absolute",
        }}
      >
        <div className="relative h-full w-full">
          {currentTrack && (
            <div className="absolute inset-0 z-0 overflow-hidden transition-opacity duration-500 ease-in-out">
              <SafeImage
                src={currentTrack.cover && currentTrack.cover.lg}
                alt=""
                width={1200}
                height={1200}
                className="!object-cover !w-full !h-full"
                style={{
                  filter: "blur(30px) brightness(0.1)",
                  transform: "scale(1.1)",
                }}
                quality={75}
              />
            </div>
          )}
          <div className="relative z-10">
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
              {currentTrack && (
                <article className="flex-shrink-0 min-w-[285px] max-w-[46vw] flex flex-col items-center">
                  <Link
                    href={`/tracks/${currentTrack?.id}`}
                    onClick={() => setPlayerScreenIsActive(false)}
                    className="w-full"
                  >
                    <SafeImage
                      src={currentTrack.cover && currentTrack.cover.lg}
                      alt={currentTrack.name}
                      width={1200}
                      height={1200}
                      className="!rounded-lg !w-full !h-full"
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
              )}
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
                  {/* <button
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
                  </button> */}
                  {!!lyrics.length && (
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
                  )}
                </header>
                {currentTrack && showQueue && (
                  <Queue
                    currentTrack={currentTrack}
                    history={history}
                    playingFrom={playingFrom}
                    queue={queue}
                    upcoming={upcoming}
                    setPlayerScreenIsActive={setPlayerScreenIsActive}
                    handleClick={handleClick}
                    isPlaying={isPlaying}
                  />
                )}
                {currentTrack && showLyrics && <Lyrics lyrics={lyrics} audioRef={audioRef} />}
              </article>
            </section>
          </div>
        </div>
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
  handleClick,
  isPlaying,
}: {
  isPlaying: boolean;
  history: playerTrackProps[];
  playingFrom: string;
  currentTrack: playerTrackProps;
  upcoming: playerTrackProps[];
  queue: playerTrackProps[];
  setPlayerScreenIsActive: (value: boolean) => void;
  handleClick: (
    e: React.MouseEvent<HTMLButtonElement>,
    track: playerTrackProps,
    from?: "history" | "queue" | "upcoming" | "recomendations",
  ) => void;
}) => {
  const newListQueue = queue;
  return (
    <section className="overflow-y-scroll h-[calc(100vh-344px)]  ">
      {history.length !== 0 && (
        <ul className="mb-8">
          {history.map((track) => (
            <li
              key={track.id}
              className="flex gap-4 hover:[&>button>.play]:!flex hover:[&>button>img]:!brightness-25 hover:[&>button>div>svg]:!brightness-45 hover:bg-background-400/30 py-2 px-3 ml-[4px] rounded-xl"
            >
              <button
                className="relative h-12 w-12 flex items-center justify-center cursor-pointer"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  handleClick(e, track, "history");
                }}
              >
                <SafeImage
                  src={track.cover && track.cover.lg}
                  alt={track.name}
                  width={48}
                  height={48}
                  className="!rounded-sm !opacity-60 !transition-[filter] !duration-200"
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
          className={`flex gap-4 hover:[&>button>.play]:!flex hover:[&>button>img]:!brightness-45 hover:[&>button>div>svg]:!brightness-45 hover:bg-background-400/30 py-2 px-2 ml-2 mt-4 rounded-xl ${"mb-8"}`}
        >
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              handleClick(e, currentTrack);
            }}
            className="relative h-12 w-12 flex items-center justify-center cursor-pointer "
          >
            <SafeImage
              src={currentTrack.cover && currentTrack.cover.lg}
              alt={currentTrack.name}
              width={48}
              height={48}
              className="!rounded-sm !transition-[filter] !duration-200"
            />
            {isPlaying ? (
              <Play className="play absolute hidden z-50" />
            ) : (
              <Pause className="play absolute hidden z-50" />
            )}
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
      {newListQueue.slice(1, newListQueue.length).length !== 0 && (
        <>
          <span className="text-[12px] text-background-200 uppercase font-semibold">
            A continuación, desde {playingFrom}:
          </span>
          <ul>
            {newListQueue.slice(1, newListQueue.length).map((track) => (
              <li
                key={track.id}
                className="flex gap-4 hover:[&>button>.play]:!flex hover:[&>button>img]:!brightness-45 hover:[&>button>div>svg]:!brightness-45 hover:bg-background-400/30 py-2 px-3  rounded-xl"
              >
                <button
                  className="relative h-12 w-12 flex items-center justify-center cursor-pointer"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    handleClick(e, track, "queue");
                  }}
                >
                  <SafeImage
                    src={track.cover && track.cover.lg}
                    alt={track.name}
                    width={48}
                    height={48}
                    className="!rounded-sm !transition-[filter] !duration-200"
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
            <li className="p-2 h-10"></li>
          </ul>
        </>
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
              className="flex gap-4 hover:[&>button>.play]:!flex hover:[&>button>img]:!brightness-25 hover:[&>button>div>svg]:!brightness-45 hover:bg-background-800 p-2 rounded-xl"
            >
              <button
                className="relative h-12 w-12 flex items-center justify-center cursor-pointer"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  handleClick(e, track, "upcoming");
                }}
              >
                <SafeImage
                  src={track.cover && track.cover.lg}
                  alt={track.name}
                  width={48}
                  height={48}
                  className="rounded-sm "
                />
                <Play className="play !absolute !hidden !z-50 " />
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
              className={`flex gap-4 font-bold text-3xl py-2 px-3 ml-[4px] rounded-xl transition-colors duration-300 ${
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
