export interface LrclibResponse {
  plainLyrics: string | null;
  syncedLyrics: string | null;
}

export interface TrackMetadata {
  title: string;
  artist: string;
}

export async function getLyricsFromLrclib({
  title,
  artist,
}: TrackMetadata): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      track_name: title,
      artist_name: artist,
    });

    const response = await fetch(`https://lrclib.net/api/get?${params.toString()}`, {
      headers: {
        "User-Agent": "MatSoundApp/1.0 (https://github.com/your-repo)",
      },
    });

    if (response.status === 404) {
      return await searchLyricsFallback(title, artist);
    }

    if (!response.ok) return null;

    const data: LrclibResponse = await response.json();
    return data.syncedLyrics || null;
  } catch (error) {
    console.error(`Error buscando letras en LRCLIB para ${title} - ${artist}:`, error);
    return null;
  }
}
async function searchLyricsFallback(title: string, artist: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${title} ${artist}`);
    const response = await fetch(`https://lrclib.net/api/search?q=${query}`);

    if (!response.ok) return null;

    const results: LrclibResponse[] = await response.json();
    if (!results || results.length === 0) return null;

    // Retornamos la letra sincronizada del primer resultado disponible
    const match = results.find((item) => item.syncedLyrics) || results[0];
    return match ? match.syncedLyrics || match.plainLyrics : null;
  } catch {
    return null;
  }
}

export async function getBulkLyricsFromLrclib(
  tracks: TrackMetadata[],
): Promise<Array<{ track: TrackMetadata; lyrics: string | null }>> {
  return await Promise.all(
    tracks.map(async (track) => {
      const lyrics = await getLyricsFromLrclib(track);
      return { track, lyrics };
    }),
  );
}
