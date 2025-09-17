interface Tracks {
  idFilter?: {
    artistId?: string;
    albumId?: string;
    trackId?: string;
  };
  options?: {
    type?: string;
    hasTransition?: boolean;
    isPlaylist?: boolean;
    maxTracks?: number;
    isRecomendation?: boolean;
    unlimited?: boolean;
    size?: "lg";
  };
}
export default function Carousel({ idFilter, options }: Tracks) {
  let tracks,
    moreTracks = [] as any[];

  const hasIdFilter = Boolean(idFilter);
  const hasOptions = Boolean(options);

  /* const isFilterByArtistId =
    hasIdFilter && idFilter?.artistId && hasOptions && options?.isRecomendation;

  if ((!idFilter?.artistId && !idFilter?.albumId) || isRecomendation) {
    const { data } = await getTracks({ query: `?max=${maxTracks}` });

    if (!data) return;
    tracks = isPlaylist ? data.tracks : data.tracks;
  }

  if (isRecomendation) {
    if (idFilter?.artistId) {
      tracks = tracks?.filter((newTrack) => newTrack.artist?.id !== artistId);
    }
    if (idFilter?.albumId) {
      tracks = tracks?.filter((newTrack) => newTrack.album?.id !== albumId);
    }
    if (idFilter?.trackId) {
      tracks = tracks?.filter((newTrack) => newTrack?.id !== trackId);
    }
  } else {
    if (idFilter?.artistId) {
      const { data } = await getTracksByArtistId(artistId);
      if (!data) return;
      tracks = sortArray(data.tracks);
    }
    if (idFilter?.albumId) {
      const { data } = await getTracksByAlbumId(albumId);
      if (!data) return;
      tracks = data.tracks;
    }
  }
  if (!unlimited) {
    tracks = tracks?.slice(0, maxTracks);
  }
  if (type === "column") {
    const { data: newDataTracks, errors: tracksErrors } = await getTracks({
      query: `?max=10&exclude=${JSON.stringify(
        tracks?.map((track) => track.id)
      )}`,
    });

    if (tracksErrors.length > 0)
      return Astro.redirect("/500", HttpStatusCode.INTERNAL_SERVER_ERROR);
    moreTracks = moreTracks.concat(newDataTracks?.tracks);
  } */
  return (
    <ul
      className={
        "flex overflow-x-auto overflow-y-hidden" + options?.type === "row"
          ? "gap-4"
          : "flex-col gap-2"
      }
    >
      {/* {options?.type === "column"
        ? tracks?.map((track: trackProps) => (
            <ColumnCard
              track={track}
              tracks={tracks}
              nextTracks={moreTracks}
              isPlaylist={isPlaylist}
              client:load
            />
          ))
        : tracks?.map((track: trackProps) => (
            <Track track={track} size={size} />
          ))} */}
    </ul>
  );
}
