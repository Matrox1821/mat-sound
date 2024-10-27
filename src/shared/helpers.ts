import { usePalette } from "react-palette";
import type { RgbProps } from "../types";
import type { RefObject } from "react";
import { useProgress } from "src/hooks/usePogress";

function hexToRgb(hex?: string) {
  if (!hex) return { r: 0, g: 0, b: 0 } as RgbProps;
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 } as RgbProps;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } as RgbProps;
}

function rgbColor(image?: string | null) {
  if (!image) return { color: `0,0,0`, accentColor: `0,0,0` };

  const { data } = usePalette(image + "?solve-cors-errorsadasd");

  const color = hexToRgb(data.lightMuted);

  const accentColor = hexToRgb(data.darkMuted);

  return {
    color: `${color.r},${color.g},${color.b}`,
    accentColor: `${accentColor.r},${accentColor.g},${accentColor.b}`,
  };
}

enum AMOUNTS {
  thousand = 1000,
  million = 1000000,
  billion = 1000000000,
  trillion = 1000000000000,
}

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

const parseAudioProgress = ({
  audio,
}: {
  audio: RefObject<HTMLAudioElement>;
}) => {
  const { currentTime } = useProgress(audio);

  return audio.current && currentTime
    ? (currentTime * 100) / audio.current.duration
    : 0;
};

const formatTime = (time: number | undefined) => {
  if (!time) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes ?? "0"}:${seconds ?? "00"}`;
};

const sortArray = <T>(array: T[] | undefined) => {
  if (array == undefined) return array;
  return array.sort(() => Math.random() - 0.5);
};

const monthNames = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const parseDateTime = (date: string) => {
  const dateTime = new Date(date);
  const year = dateTime.getFullYear();
  const month = monthNames[dateTime.getMonth()];
  const day = dateTime.getDay();
  return {
    fullDate: `${month} ${day}, ${year}`,
    year: year,
    month: month,
    day: day,
  };
};

export {
  hexToRgb,
  rgbColor,
  parseNumberListeners,
  parseAudioProgress,
  formatTime,
  sortArray,
  parseDateTime,
};
