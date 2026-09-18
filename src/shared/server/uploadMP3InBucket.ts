import { BotGuardClient, getChallenge } from "bgutils-js/botguard";
import type { WebPoSignalOutput } from "bgutils-js/shared-types";
import { buildURL, getHeaders, USER_AGENT } from "bgutils-js/utils";
import { WebPoMinter } from "bgutils-js/webpo";
import { JSDOM } from "jsdom";
import Innertube, { Platform, UniversalCache } from "youtubei.js";
import type { Types } from "youtubei.js";
import { Readable } from "stream";
import { uploadFileToBucket } from "./files";
import { GET_BUCKET_URL } from "../utils/constants";

export interface ProcessedTrackData {
  duration: number;
  route: string;
}

Platform.shim.eval = async (data: Types.BuildScriptResult) => new Function(data.output)();

let contextPromise: Promise<{ innertube: Innertube; webPoMinter: WebPoMinter }> | null = null;

async function createYouTubeContext() {
  const requestKey = "O43z0dpjhgX20SCx4KAo";

  // Shim de DOM: el script de BotGuard espera un entorno de navegador.
  const dom = new JSDOM(
    '<!DOCTYPE html><html lang="en"><head><title></title></head><body></body></html>',
    {
      url: "https://www.youtube.com/",
      referrer: "https://www.youtube.com/",
    },
  );

  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    location: dom.window.location,
    origin: dom.window.origin,
    headers: { userAgent: USER_AGENT },
  });

  if (!Reflect.has(globalThis, "navigator")) {
    Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator });
  }

  // 1. Challenge de BotGuard
  const challenge = await getChallenge({ fetchFunction: fetch, requestKey });

  const interpreterJavascript =
    challenge.interpreterJavascript?.privateDoNotAccessOrElseSafeScriptWrappedValue;

  if (!interpreterJavascript) {
    throw new Error("Interpreter javascript no disponible.");
  }
  new Function(interpreterJavascript)();

  const botGuardClient = await BotGuardClient.create({
    program: challenge.program,
    globalName: challenge.globalName,
    globalObject: globalThis,
  });

  // 2. Minter de WebPO Tokens
  const webPoSignalOutput: WebPoSignalOutput = [];
  const botguardResponse = await botGuardClient.snapshot({ webPoSignalOutput });

  const integrityTokenResponse = await fetch(buildURL("GenerateIT", true), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify([requestKey, botguardResponse]),
  });

  const [integrityToken, estimatedTtlSecs, mintRefreshThreshold, websafeFallbackToken] =
    (await integrityTokenResponse.json()) as [string, number, number, string];

  const webPoMinter = await WebPoMinter.create(
    { integrityToken, estimatedTtlSecs, mintRefreshThreshold, websafeFallbackToken },
    webPoSignalOutput,
  );

  const innertube = await Innertube.create({ cache: new UniversalCache(true) });

  console.log("[YouTube] Contexto BotGuard/PO Token inicializado correctamente.");

  return { innertube, webPoMinter };
}

function getYouTubeContext() {
  if (!contextPromise) {
    contextPromise = createYouTubeContext().catch((err) => {
      contextPromise = null; // permite reintentar en la próxima llamada
      throw err;
    });
  }
  return contextPromise;
}

function getFormatInfo(format: any) {
  return {
    itag: format.itag,
    mimeType: format.mime_type,
    bitrate: format.bitrate,
    audioQuality: format.audio_quality,
    sampleRate: format.audio_sample_rate,
    channels: format.audio_channels,
    hasAudio: format.has_audio,
    hasVideo: format.has_video,
    url: format.url,
    track: format.caption_track,
  };
}

export async function uploadMP3InBucket(query: string, route: string): Promise<ProcessedTrackData> {
  console.log(`[YouTube] Buscando: "${query}"`);

  const { innertube, webPoMinter } = await getYouTubeContext();

  const results = await innertube.search(query, { type: "video" });

  const firstVideo = results.videos?.find((item) => "id" in item && typeof item.id === "string");

  if (!firstVideo || !("id" in firstVideo)) {
    throw new Error(`No se encontró ningún video para: "${query}"`);
  }

  const videoId = firstVideo.id as string;

  console.log(`[YouTube] Video seleccionado: ${videoId}`);

  // Token content-bound al video específico
  const contentPoToken = await webPoMinter.mintAsWebsafeString(videoId);

  // MWEB es el cliente que funciona de forma confiable con streaming_data + decipher
  const info = await innertube.getBasicInfo(videoId, { client: "MWEB" });

  const duration = info.basic_info.duration ?? 0;

  console.log("[YouTube] Información:", {
    id: videoId,
    title: info.basic_info.title,
    duration,
  });

  if (!info.streaming_data) {
    throw new Error(`YouTube no devolvió streaming_data para ${videoId}`);
  }

  const selectedFormat = info.chooseFormat({ quality: "best", type: "audio" });
  console.log("[YouTube] Formato elegido:", getFormatInfo(selectedFormat));

  const decipheredUrl = await selectedFormat.decipher(innertube.session.player);

  if (!decipheredUrl) {
    throw new Error(`No se pudo descifrar la URL del formato. itag=${selectedFormat.itag}`);
  }

  const audioStreamingURL = `${decipheredUrl}&pot=${encodeURIComponent(contentPoToken)}`;

  console.log(`[YouTube] URL resuelta correctamente para itag ${selectedFormat.itag}`);

  const response = await fetch(audioStreamingURL);

  if (!response.ok || !response.body) {
    throw new Error(`No se pudo descargar el audio desde YouTube. HTTP ${response.status}`);
  }

  const streamAudio = Readable.fromWeb(response.body as any);

  await uploadFileToBucket(streamAudio, route);

  return {
    duration,
    route: GET_BUCKET_URL + route,
  };
}
