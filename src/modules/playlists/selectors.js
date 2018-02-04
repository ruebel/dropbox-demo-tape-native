export const getPlayingTrack = state => {
  const playlist = getSelectedPlaylist(state);
  if (
    !playlist ||
    !playlist.data ||
    !playlist.data.tracks ||
    playlist.data.tracks.length < state.audio.index + 1
  ) {
    return null;
  }
  return playlist.data.tracks[state.audio.index];
};

export const getSelectedPlaylist = state => {
  if (!state.playlists.selectedId) {
    return;
  }
  return state.playlists.data.find(
    playlist => playlist.data.id === state.playlists.selectedId
  );
};
