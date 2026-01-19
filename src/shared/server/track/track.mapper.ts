export const mapTrack = (track: any, userId?: string, userPlaylists?: any) => {
  return {
    ...track,
    isLiked: userId ? track.likes.length > 0 : false,
    likes: undefined, // Limpiamos para no enviar basura al cliente
    userPlaylists: userPlaylists?.playlists.map((playlist: any) => ({
      ...playlist,
      isInPlaylist: playlist.tracks.some((t: any) => t.track.id === track.id),
      tracks: undefined, // No necesitamos enviar todos los tracks de la playlist aquí
    })),
  };
};
