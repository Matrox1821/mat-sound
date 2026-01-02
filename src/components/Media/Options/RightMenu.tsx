"use client";
import { Play } from "@/components/UI/Icons/Playback/Play";
import { RightMenuIcon } from "@/components/UI/Icons/Playback/RightMenu";
import { useUIStore } from "@/store/activeStore";
import { usePlayerStore } from "@/store/playerStore";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "primereact/sidebar";
export const RightMenu = () => {
  const { playerRightMenuIsActive, setPlayerRightMenuIsActive, setPlayerScreenIsActive } =
    useUIStore();
  const { history, currentTrack, queue, playingFrom } = usePlayerStore();

  const newListQueue = queue;
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
                  <button className="relative h-12 w-12 flex items-center justify-center cursor-pointer ">
                    <Image
                      src={track.cover.lg}
                      alt={track.name}
                      width={48}
                      height={48}
                      className="rounded-sm opacity-60"
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
              <button className="relative h-12 w-12 flex items-center justify-center cursor-pointer ">
                <Image
                  src={currentTrack.cover.lg}
                  alt={currentTrack.name}
                  width={48}
                  height={48}
                  className="rounded-sm "
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
