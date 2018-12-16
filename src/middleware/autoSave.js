import * as playlists from '../modules/playlists';

const SAVE_TIME = 3 * 1000;
let timer = null;

/**
 * Redux Middleware
 * Checkes for pending playlists changes and autoSaves the pending
 * changes every SAVE_TIME ms
 */
export default store => next => action => {
  const result = next(action);
  if (!timer) {
    timer = setTimeout(() => savePlaylistsWithPendingChanges(store), SAVE_TIME);
  }
  return result;
};

const savePlaylistsWithPendingChanges = store => {
  const state = store.getState();
  const pending = playlists.selectors.getPlaylistsWithPendingChanges(state);
  pending.forEach(playlist =>
    store.dispatch(playlists.actions.savePlaylist(playlist))
  );
  timer = null;
};
