"use client";
import { Play } from "@components/ui/icons/playback/Play";
import { RightMenuIcon } from "@components/ui/icons/playback/RightMenu";
import { SafeImage } from "@components/ui/images/SafeImage";
import { useAppUIStore } from "@/store/appUIStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";
import { playerTrackProps } from "@shared-types/track.types";
import Link from "next/link";
import { Sidebar } from "primereact/sidebar";

export const RightMenu = () => {
  const { playerRightMenuIsActive, setPlayerRightMenuIsActive, setPlayerScreenIsActive } =
    useAppUIStore();

  // 1. Traemos los Ids y la función para buscar en caché
  const {
    historyIds,
    queueIds,
    upcomingIds,
    getCurrentTrack,
    getTrackFromCache,
    addTracksToCache,
    playingFrom,
  } = usePlayerStore();

  const currentTrack = getCurrentTrack();
  const { isPlaying, play, pause } = usePlaybackStore((state) => state);

  // Transformamos los IDs en objetos para poder mapearlos en el render
  const historyTracks = historyIds
    .map((id) => getTrackFromCache(id))
    .filter((track): track is playerTrackProps => !!track);

  const queueTracks = queueIds
    .map((id) => getTrackFromCache(id))
    .filter((track): track is playerTrackProps => !!track);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    track: playerTrackProps,
    from?: "history" | "queue" | "upcoming" | "recomendations",
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (!track.song) return;

    if (track.id === currentTrack?.id) {
      isPlaying ? pause() : play();
      return;
    }

    // 2. Diccionario de acciones adaptado a IDs
    const listActions = {
      history: () => {
        const hIndex = historyIds.indexOf(track.id);
        if (hIndex === -1) return null;
        return {
          historyIds: historyIds.slice(0, hIndex),
          queueIds: [...historyIds.slice(hIndex), ...queueIds],
        };
      },
      queue: () => {
        const qIndex = queueIds.indexOf(track.id);
        if (qIndex === -1) return null;
        return {
          historyIds: [...historyIds, ...queueIds.slice(0, qIndex)],
          queueIds: queueIds.slice(qIndex),
        };
      },
      upcoming: () => {
        const uIndex = upcomingIds.indexOf(track.id);
        if (uIndex === -1) return null;
        return {
          historyIds: [...historyIds, ...queueIds, ...upcomingIds.slice(0, uIndex)],
          queueIds: [upcomingIds[uIndex]],
          upcomingIds: upcomingIds.slice(uIndex + 1),
        };
      },
      recomendations: () => {
        return {
          historyIds: [],
          queueIds: [track.id],
          upcomingIds: [],
        };
      },
    };

    if (from && listActions[from]) {
      const newStates = listActions[from]();

      if (newStates) {
        // Aseguramos que el track clickeado esté en el caché por si viene de recomendaciones
        addTracksToCache([track]);

        // Actualizamos el store usando la nueva convención de nombres
        usePlayerStore.setState({
          currentTrackId: track.id,
          ...newStates,
        });
        play();
      }
    }
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
          {/* HISTORY LIST */}
          {historyTracks.length !== 0 && (
            <ul>
              {historyTracks.map((track) => (
                <li
                  key={track.id}
                  className="flex gap-4 hover:[&>button>.play]:!flex hover:[&>button>img]:!brightness-25 hover:bg-background-800 p-2 rounded-xl"
                >
                  <button
                    className="relative h-12 w-12 flex items-center justify-center cursor-pointer"
                    onClick={(e) => handleClick(e, track, "history")}
                  >
                    <SafeImage
                      src={track.cover?.lg}
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
            Reproduciendo desde: {playingFrom?.from}
          </span>

          {/* CURRENT TRACK */}
          {currentTrack && (
            <div
              className={`flex gap-4 hover:[&>button>.play]:!flex hover:[&>button>img]:!brightness-25 hover:bg-background-800 p-2 rounded-xl ${
                historyTracks.length > 0 ? "my-10" : "mb-8"
              }`}
            >
              <button
                className="relative h-12 w-12 flex items-center justify-center cursor-pointer"
                onClick={(e) => handleClick(e, currentTrack)}
              >
                <SafeImage
                  src={currentTrack.cover?.lg}
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

          {/* QUEUE LIST */}
          {/* Mantenemos tu .slice(1, -1) original, pero aplicándolo a queueTracks */}
          {queueTracks.slice(1, -1).length !== 0 && (
            <ul>
              {queueTracks.slice(1, -1).map((track) => (
                <li
                  key={track.id}
                  className="flex gap-4 hover:[&>button>.play]:!flex hover:[&>button>img]:!brightness-25 hover:bg-background-800 p-2 rounded-xl"
                >
                  <button
                    className="relative h-12 w-12 flex items-center justify-center cursor-pointer"
                    onClick={(e) => handleClick(e, track, "queue")}
                  >
                    <SafeImage
                      src={track.cover?.lg}
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
