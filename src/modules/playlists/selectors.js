export const getSelectedPlaylist = state => {
  if (!state.playlists.selectedId) {
    return;
  }
  return state.playlists.data.find(
    playlist => playlist.data.id === state.playlists.selectedId
  );
};
