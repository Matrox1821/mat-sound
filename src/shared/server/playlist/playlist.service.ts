"use server";
import { headers } from "next/headers";
import { getPlaylistById } from "./playlist.repository";
import { PlaylistService } from "@/types/playlist.types";
import { auth } from "@/lib/auth";
import { getRandomTracksIds, getTracksByIds } from "../track/track.repository";
import { TrackById } from "@/types/track.types";

export async function getPlaylist({
  id,
}: {
  id: string;
}): Promise<{ playlist: PlaylistService; recommendedTracks: TrackById[] | null }> {
  const session = await auth.api.getSession({ headers: await headers() });

  const playlist = await getPlaylistById(id);
  const { _count, tracks, ...rest } = playlist;

  const tracksIds = tracks.map(({ track }) => track.id);

  const recommendedTracksIds = await getRandomTracksIds(20, tracksIds);

  console.log(recommendedTracksIds);
  const recommendedTracks = await getTracksByIds({
    trackIds: recommendedTracksIds.map(({ id }) => id),
  });
  return {
    playlist: {
      ...rest,
      tracksCount: _count.tracks,
      tracks: tracks.map(({ track }) => track),
      coverListDefault: tracks.slice(0, 1).map(({ track }) => track.cover),
      canEdit: session?.user?.username === rest.user.username,
    },
    recommendedTracks,
  };
}
