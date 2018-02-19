export const getPlayingTrack = state => {
  const playlist = getSelectedPlaylist(state);
  if (
    !playlist ||
    !playlist.data ||
    !playlist.data.tracks ||
    !playlist.data.tracks.length
  ) {
    return null;
  }
  return playlist.data.tracks.find(t => t.id === state.audio.id);
};

export const getSelectedPlaylist = state => {
  if (!state.playlists.selectedId) {
    return;
  }
  return state.playlists.data.find(
    playlist => playlist.meta.id === state.playlists.selectedId
  );
};
