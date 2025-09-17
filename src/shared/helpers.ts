import { AMOUNTS, contentProps, RgbProps, storeTrackProps } from "@/types";
import { RefObject } from "react";
import { usePalette } from "react-palette";
const setAudioTrack = async ({
  audio,
  song,
  volume,
}: {
  audio: RefObject<HTMLAudioElement>;
  song: string;
  volume: number;
}) => {
  const { current: currentAudio } = audio;
  if (!currentAudio) return;

  try {
    // First pause and reset the current audio
    currentAudio.pause();
    currentAudio.currentTime = 0;

    // Set volume and source
    currentAudio.volume = volume;
    currentAudio.src = song;

    // Wait for the audio to be loaded
    await new Promise<void>((resolve, reject) => {
      const handleLoadedData = () => {
        currentAudio.removeEventListener("loadeddata", handleLoadedData);
        currentAudio.removeEventListener("error", handleError);
        resolve();
      };

      const handleError = (error: Event) => {
        currentAudio.removeEventListener("loadeddata", handleLoadedData);
        currentAudio.removeEventListener("error", handleError);
        reject(error);
      };

      currentAudio.addEventListener("loadeddata", handleLoadedData);
      currentAudio.addEventListener("error", handleError);

      // If the audio is already loaded, resolve immediately
      if (currentAudio.readyState >= 2) {
        handleLoadedData();
        currentAudio.play();
      }
    });
  } catch (error) {
    console.error("Error loading audio:", error);
    throw error;
  }
};

const parseElementToString = <T extends Record<K, { name: string }>, K extends keyof T>(
  attributeName: K,
  list?: T[] | null
): string => {
  if (!list || list.length === 0) {
    return "";
  }
  const names = list
    .map((item) => item[attributeName]?.name)
    .filter((name) => name !== undefined && name !== null);

  return names.join(", ");
};

const setAudioMediaMetadata = ({
  title,
  artist,
  album,
  src,
  handlePrevious,
  handleNext,
}: {
  title: string;
  artist: string;
  album: string;
  src: string;
  handlePrevious: () => void;
  handleNext: () => void;
}) => {
  navigator.mediaSession.metadata = new MediaMetadata({
    title,
    artist,
    album,
    artwork: [
      {
        src,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  });
  navigator.mediaSession.setActionHandler("previoustrack", () => handlePrevious());
  navigator.mediaSession.setActionHandler("nexttrack", () => handleNext());
};

const randomizeArray = <T>(array: T[]) => {
  if (array == undefined) return array;
  return array.sort(() => Math.random() - 0.5);
};

const formatTime = (time: number | undefined) => {
  if (!time) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes ?? "0"}:${seconds ?? "00"}`;
};

const formatPlaylistDuration = (time: number) => {
  const seconds = time > 3600 ? Math.floor((time / 60) % 60) : Math.floor(time % 60);
  const minutes = time > 3600 ? Math.floor(time % 60) : Math.floor(time / 60);
  const hours = time > 3600 ? Math.floor(time % 3600) : 0;
  return hours === 0
    ? `${minutes} minutos y ${seconds} segundos`
    : `${hours} horas y ${minutes} minutos`;
};

const formatR2FilePath = (props: {
  type:
    | "avatar"
    | "covers"
    | "pageCover"
    | "albumCover"
    | "trackCover"
    | "trackSong"
    | "playlist"
    | "users";
  root: "artists" | "users" | "playlists";
  artistName?: string;
  albumName?: string;
  trackName?: string;
  fileName?: string;
}): string => {
  const { albumName, trackName, type, fileName, artistName, root } = props;

  let basePath: string = root;
  let parsedFileName = "";
  let parsedAlbumName = "";
  let parsedTrackName = "";

  if (root === "artists" && artistName) basePath = `artists/${parseStringToR2NamePath(artistName)}`;
  if (fileName) parsedFileName = parseStringToR2NamePath(fileName);
  if (albumName) parsedAlbumName = parseStringToR2NamePath(albumName);
  if (trackName) parsedTrackName = parseStringToR2NamePath(trackName);

  switch (type) {
    case "playlist":
    case "playlist":
      return `${basePath}/${parsedFileName}`;
    case "avatar":
      return `${basePath}/avatar`;
    case "pageCover":
      return `${basePath}/page-cover`;
    case "covers":
      return `${basePath}/covers/${parsedFileName}`;
    case "albumCover":
      if (parsedAlbumName === "") throw new Error("albumId is required for albumCover type");
      return `${basePath}/albums/${parsedAlbumName}/cover`;
    case "trackCover":
      if (parsedTrackName === "") throw new Error("trackId is required for trackCover type");
      return `${basePath}/tracks/${parsedTrackName}/cover`;
    case "trackSong":
      if (parsedTrackName === "") throw new Error("trackId is required for trackSong type");
      return `${basePath}/tracks/${parsedTrackName}/song`;
    default:
      throw new Error("Invalid type specified");
  }
};

const parseStringToR2NamePath = (string: string) => {
  return string.replaceAll(" ", "-").toLowerCase();
};

const parseTrackStoreData = (data: contentProps) => {
  return {
    id: data.id,
    name: data.name,
    image: data.image as string,
    seconds: data.seconds,
    song: data.song,
    albums: data.albums,
    artists: data.artists || null,
    orderInPlaylist: 1,
  };
};

function parseNumberListeners(amount: number) {
  let number, fixedNumber;
  switch (true) {
    case amount >= AMOUNTS.thousand && amount < AMOUNTS.million:
      number = amount / AMOUNTS.thousand;
      fixedNumber = (amount / AMOUNTS.thousand).toFixed(1).toString();

      return `${fixedNumber.endsWith("0") ? number : fixedNumber} k`;
    case amount >= AMOUNTS.million && amount < AMOUNTS.billion:
      number = amount / AMOUNTS.million;
      fixedNumber = (amount / AMOUNTS.million).toFixed(1).toString();
      return `${
        fixedNumber.endsWith(".0")
          ? fixedNumber.slice(0, -2)
          : fixedNumber.endsWith("0")
          ? number
          : fixedNumber
      } M`;
    case amount >= AMOUNTS.billion && amount < AMOUNTS.trillion:
      number = amount / AMOUNTS.billion;
      fixedNumber = (amount / AMOUNTS.billion).toFixed(1).toString();

      return `${fixedNumber.endsWith("0") ? number : fixedNumber} B`;
    case amount >= AMOUNTS.trillion:
      number = amount / AMOUNTS.trillion;
      fixedNumber = (amount / AMOUNTS.trillion).toFixed(1).toString();

      return `${fixedNumber.endsWith("0") ? number : fixedNumber} T`;

    default:
      return `${amount}`;
  }
}

function hexToRgb(hex?: string) {
  if (!hex) return "20, 20, 20";
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "20, 20, 20";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
function rgbColor(image?: string | null, transparency?: number) {
  const defaultValue = `rgba(20,20,20, ${transparency || 0})`;
  if (!image)
    return {
      darkMuted: defaultValue,
      darkVibrant: defaultValue,
      lightMuted: defaultValue,
      lightVibrant: defaultValue,
      muted: defaultValue,
      vibrant: defaultValue,
    };

  const { data } = usePalette(image + "?solve-cors-errorsadasd");

  return {
    darkMuted: `rgba(${hexToRgb(data.darkMuted)}, ${transparency || 1})`,
    darkVibrant: `rgba(${hexToRgb(data.darkVibrant)}, ${transparency || 1})`,
    lightMuted: `rgba(${hexToRgb(data.lightMuted)}, ${transparency || 1})`,
    lightVibrant: `rgba(${hexToRgb(data.lightVibrant)}, ${transparency || 1})`,
    muted: `rgba(${hexToRgb(data.muted)}, ${transparency || 1})`,
    vibrant: `rgba(${hexToRgb(data.vibrant)}, ${transparency || 1})`,
  };
}

const slidesPerView = (isMobile: boolean, size: number) => {
  const asideSize = 272;

  const paddingXOfFather = isMobile ? 16 + 0 : asideSize + 32 + 32;
  const fatherSize = size - paddingXOfFather;

  const cardContentSize = 160;
  const marginRigthOfCard = 16;
  const cardSize = cardContentSize + marginRigthOfCard;

  return Math.floor(fatherSize / cardSize);
};

export {
  formatPlaylistDuration,
  setAudioTrack,
  parseElementToString,
  setAudioMediaMetadata,
  randomizeArray,
  formatTime,
  formatR2FilePath,
  parseStringToR2NamePath,
  parseTrackStoreData,
  parseNumberListeners,
  rgbColor,
  slidesPerView,
};
