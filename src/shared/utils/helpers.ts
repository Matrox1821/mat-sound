import { AMOUNTS } from "@/types";
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

const randomizeArrayExceptFirst = <T>(currentIndex: number, array: T[]) => {
  if (!array || array.length <= 1) return array;
  if (currentIndex < 0 || currentIndex >= array.length) return array;
  /* const [first, ...rest] = array; */
  const target = array[currentIndex];
  const rest = array.filter((_, i) => i !== currentIndex);

  // Shuffle del resto usando Fisher–Yates
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }

  return [target, ...rest];
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
    | "mainCover"
    | "albumCover"
    | "trackCover"
    | "trackSong"
    | "playlist"
    | "users";
  id?: string;
  size?: "sm" | "md" | "lg";
  fileName?: string;
}): string => {
  const { id, type, fileName, size } = props;

  let parsedFileName = "";
  if (fileName) parsedFileName = parseStringToR2NamePath(fileName);

  switch (type) {
    case "playlist":
    case "playlist":
      return `playlists/${id}/cover/${size || "md"}.webp`;
    case "avatar":
      return `artists/${id}/avatar/${size || "md"}.webp`;
    case "mainCover":
      return `artists/${id}/main-cover.webp`;
    case "covers":
      return `artists/${id}/covers/${parsedFileName}.webp`;
    case "albumCover":
      return `albums/${id}/cover/${size || "md"}.webp`;
    case "trackCover":
      return `tracks/${id}/cover/${size || "md"}.webp`;
    case "trackSong":
      return `tracks/${id}/song.mp3`;
    default:
      throw new Error("Invalid type specified");
  }
};

const parseStringToR2NamePath = (string: string) => {
  return string.replaceAll(" ", "-").toLowerCase();
};

/* const parseTrackStoreData = (data: contentProps) => {
  return {
    id: data.id,
    name: data.name,
    image: data.image.sm,
    seconds: data.seconds,
    song: data.song,
    albums: data.albums,
    artists: data.artists || null,
    orderInPlaylist: 1,
  };
}; */

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

const genreCapitalize = (genre: string) => {
  return genre
    .split(" ")
    .map((word) =>
      word
        .split(/([&/-])/g)
        .map((part) =>
          /^[a-zA-Z]/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part
        )
        .join("")
    )
    .join(" ");
};

function sortObject<T extends Record<string, any>>(obj: T) {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b))) as T;
}

type LyricLine = {
  start: number;
  end?: number;
  lyrics: string;
};
function parseLyricsToObject(lrc: string) {
  const regex = /\[(\d{2}):(\d{2}\.\d{2})\]([\s\S]*?)(?=\[\d{2}:\d{2}\.\d{2}\]|$)/g;

  const results: LyricLine[] = [];
  let match;

  while ((match = regex.exec(lrc)) !== null) {
    const minutes = Number(match[1]);
    const seconds = Number(match[2]);
    const start = minutes * 60 + seconds;

    const rawText = match[3]; // NO tocamos \n ni \

    results.push({
      start,
      lyrics: rawText,
    });
  }

  for (let i = 0; i < results.length; i++) {
    const current = results[i];
    const next = results[i + 1];

    current.end = next ? next.start : 99999;
  }

  return results;
}

export {
  formatPlaylistDuration,
  setAudioTrack,
  parseElementToString,
  setAudioMediaMetadata,
  randomizeArrayExceptFirst,
  formatTime,
  formatR2FilePath,
  parseStringToR2NamePath,
  parseNumberListeners,
  rgbColor,
  slidesPerView,
  genreCapitalize,
  sortObject,
  parseLyricsToObject,
};
