import { resizeImage, uploadFileToBucket } from "./files";

async function getDirectCoverUrl(url: string): Promise<string> {
  const cleanUrl = url.trim();

  // Si ya es un link directo a un archivo de imagen, devolverlo directo
  if (/\.(jpg|jpeg|png|webp)(\?.*)?$/i.test(cleanUrl)) {
    return cleanUrl;
  }

  // SPOTIFY
  if (cleanUrl.includes("spotify.com")) {
    const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(cleanUrl)}`);
    if (!res.ok) throw new Error("No se pudo obtener la portada de Spotify.");
    const data = await res.json();
    return data.thumbnail_url;
  }

  // TIDAL
  if (cleanUrl.includes("tidal.com")) {
    const res = await fetch(`https://oembed.tidal.com/scheme?url=${encodeURIComponent(cleanUrl)}`);
    if (!res.ok) throw new Error("No se pudo obtener la portada de Tidal.");
    const data = await res.json();
    return data.thumbnail_url;
  }

  // YOUTUBE / YOUTUBE MUSIC
  if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) {
    try {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`,
      );
      if (res.ok) {
        const data = await res.json();
        return data.thumbnail_url;
      }
    } catch {
      // Fallback manual por ID de video si falla oEmbed
    }

    const videoIdMatch = cleanUrl.match(
      /(?:v=|\/vi\/|youtu\.be\/|\/v\/|\/embed\/|\/watch\?v=)([^#&?]*)/,
    );
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://i.ytimg.com/vi/${videoIdMatch[1]}/hqdefault.jpg`;
    }
  }

  throw new Error("Plataforma no soportada o URL inválida.");
}

export async function fetchCoverAsFile(imageUrl: string, filename = "cover.jpg"): Promise<File> {
  const response = await fetch(imageUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Error descargando la portada desde: ${imageUrl}`);
  }

  const blob = await response.blob();
  const contentType = response.headers.get("content-type") || "image/jpeg";

  return new File([blob], filename, { type: contentType });
}

export async function uploadWebpToBucket({
  sourceUrl,
  archiveType,
  id,
}: {
  sourceUrl: string;
  archiveType: "albumCover" | "trackCover";
  id: string;
}) {
  const directImageUrl = await getDirectCoverUrl(sourceUrl);

  const coverFile = await fetchCoverAsFile(directImageUrl);

  const imageVariants = await resizeImage({
    file: coverFile,
    archiveType,
    id,
  });

  const uploadTasks = (["sm", "md", "lg"] as const).map(async (size) => {
    const buffer = imageVariants.buffer[size];
    const r2Path = imageVariants.r2Path![size];

    if (buffer && r2Path) {
      await uploadFileToBucket(buffer, r2Path);
    }
  });

  await Promise.all(uploadTasks);

  return imageVariants.dbPath;
}
