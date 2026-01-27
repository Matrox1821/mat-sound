"use client";
import { Play } from "@components/ui/icons/playback/Play";
import { RightMenuIcon } from "@components/ui/icons/playback/RightMenu";
import { SafeImage } from "@components/ui/images/SafeImage";
import { useUIStore } from "@/store/activeStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";
import { playerTrackProps } from "@shared-types/track.types";
import Link from "next/link";
import { Sidebar } from "primereact/sidebar";
export const RightMenu = () => {
  const { playerRightMenuIsActive, setPlayerRightMenuIsActive, setPlayerScreenIsActive } =
    useUIStore();
  const { history, currentTrack, queue, playingFrom, upcoming, setPlayingFrom } = usePlayerStore();

  const newListQueue = queue;

  const { isPlaying, play, pause } = usePlaybackStore((state) => state);

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
        setPlayingFrom("");
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
    <div className="flex items-center gap-2 relative justify-center">
      <button
        className={`p-[5px] h-8 w-8 flex items-center justify-center rounded-lg cursor-pointer ${
          playerRightMenuIsActive ? "bg-background-700" : ""
        }`}
        onClick={() => {
          setPlayerRightMenuIsActive(!playerRightMenuIsActive);
          setPlayerScreenIsActive(false);
        }}
      >
        <RightMenuIcon className="w-7 h-7" />
      </button>
      <Sidebar
        visible={playerRightMenuIsActive}
        position="right"
        modal={false}
        onHide={() => setPlayerRightMenuIsActive(false)}
        showCloseIcon={false}
        dismissable={false}
        className="!h-[calc(100vh-168px)] !w-[390px] !bottom-[100px] !right-6 !absolute !bg-background-950 !border-none !rounded-lg [&>.p-sidebar-header]:!p-0 [&>.p-sidebar-content]:!overflow-y-hidden [&>.p-sidebar-content]:!pr-0"
      >
        <h3 className="text-[15px] text-content-950/90 font-semibold py-6"> Reproducir cola</h3>

        <section className="h-[calc(100vh-238px)] overflow-y-scroll">
          {history.length !== 0 && (
            <ul>
              {history.map((track) => (
                <li
                  key={track.id}
                  className="flex gap-4 hover:[&>button>.play]:!flex hover:[&>button>img]:!brightness-25 hover:bg-background-800 p-2 rounded-xl"
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
                      className="!rounded-sm !opacity-60"
                    />
                    <Play className="play absolute hidden z-50 opacity-95" />
                  </button>
                  <span className="flex flex-col h-full justify-evenly w-4/5 opacity-60">
                    <Link
                      href={`/tracks/${track.id}`}
                      className="w-2/3 overflow-ellipsis overflow-x-hidden hover:underline"
                    >
                      {track.name}
                    </Link>

                    {track.artists?.map((artist, i) => (
                      <Link
                        key={artist.id}
                        href={`/artists/${artist.id}`}
                        className="hover:underline w-1/3 overflow-ellipsis overflow-x-hidden text-background-400"
                      >
                        {artist.name} {track.artists!.length - 1 < i ? " • " : ""}
                      </Link>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <span className="text-[12px] text-background-200 uppercase font-semibold">
            Reproduciendo desde: {playingFrom}
          </span>
          {currentTrack && (
            <div
              className={`flex gap-4 hover:[&>button>.play]:!flex hover:[&>button>img]:!brightness-25 hover:bg-background-800 p-2 rounded-xl ${
                history.length > 0 ? "my-10" : "mb-8"
              }`}
            >
              <button
                className="relative h-12 w-12 flex items-center justify-center cursor-pointer"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  handleClick(e, currentTrack);
                }}
              >
                <SafeImage
                  src={currentTrack.cover && currentTrack.cover.lg}
                  alt={currentTrack.name}
                  width={48}
                  height={48}
                  className="!rounded-sm"
                />
                <Play className="play absolute hidden z-50 " />
              </button>
              <span className="flex flex-col h-full justify-evenly w-4/5 ">
                <Link
                  href={`/tracks/${currentTrack.id}`}
                  className="w-2/3 overflow-ellipsis overflow-x-hidden hover:underline"
                >
                  {currentTrack.name}
                </Link>

                {currentTrack.artists?.map((artist, i) => (
                  <Link
                    key={artist.id}
                    href={`/artists/${artist.id}`}
                    className="hover:underline w-1/3 overflow-ellipsis overflow-x-hidden text-background-400"
                  >
                    {artist.name} {currentTrack.artists!.length - 1 < i ? " • " : ""}
                  </Link>
                ))}
              </span>
            </div>
          )}
          <span className="text-[12px] text-background-200 uppercase font-semibold">
            A continuación:
          </span>
          {newListQueue.slice(1, -1).length !== 0 && (
            <ul>
              {newListQueue.slice(1, -1).map((track) => (
                <li
                  key={track.id}
                  className="flex gap-4 hover:[&>button>.play]:!flex hover:[&>button>img]:!brightness-25 hover:bg-background-800 p-2 rounded-xl"
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
                      className="!rounded-sm"
                    />
                    <Play className="play absolute hidden z-50 " />
                  </button>
                  <span className="flex flex-col h-full justify-evenly w-4/5 ">
                    <Link
                      href={`/tracks/${track.id}`}
                      className="w-2/3 overflow-ellipsis overflow-x-hidden hover:underline"
                    >
                      {track.name}
                    </Link>

                    {track.artists?.map((artist, i) => (
                      <Link
                        key={artist.id}
                        href={`/artists/${artist.id}`}
                        className="hover:underline w-1/3 overflow-ellipsis overflow-x-hidden text-background-400"
                      >
                        {artist.name} {track.artists!.length - 1 < i ? " • " : ""}
                      </Link>
                    ))}
                  </span>
                </li>
              ))}
              <li className="p-2 h-20"></li>
            </ul>
          )}
        </section>
      </Sidebar>
    </div>
  );
};
