/* export default function Tracks() {
  const {
    hasTransition = false,
    type,
    isPlaylist = false,
    artistId,
    albumId,
    maxTracks = 7,
    isRecomendation = false,
    trackId,
    unlimited = false,
    size = "lg",
  } = Astro.props;

  let tracks,
    moreTracks = [] as any[];

  if (artistId && !isRecomendation) {
    const { data } = await getTracksByArtistId(artistId);
    if (!data) return;
    tracks = sortArray(data.tracks);
  }

  if (albumId && !isRecomendation) {
    const { data } = await getTracksByAlbumId(albumId);
    if (!data) return;
    tracks = data.tracks;
  }

  if ((!artistId && !albumId) || isRecomendation) {
    const { data } = await getTracks({ query: `?max=${maxTracks}` });

    if (!data) return;
    tracks = isPlaylist ? data.tracks : data.tracks;
  }

  if (isRecomendation) {
    if (artistId) {
      tracks = tracks?.filter((newTrack) => newTrack.artist?.id !== artistId);
    }
    if (albumId) {
      tracks = tracks?.filter((newTrack) => newTrack.album?.id !== albumId);
    }
    if (trackId) {
      tracks = tracks?.filter((newTrack) => newTrack?.id !== trackId);
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
  }
  return (
    <ul
      className="flex overflow-x-auto overflow-y-hidden"
      class:list={type === "row" ? "gap-4" : "flex-col gap-2"}
    >
      {type === "column"
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
          ))}
    </ul>
  );
}
 */
