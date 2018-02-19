import { getSelectedPlaylist } from './playlists/selectors';

const prefix = 'AUDIO';

const initialState = {
  id: null,
  isPlaying: false,
  loop: false,
  paused: true
};

export const types = {
  PAUSE: `${prefix}/PAUSE`,
  PLAY: `${prefix}/PLAY`,
  STOP: `${prefix}/STOP`
};

const checkPlaylist = playlist =>
  playlist &&
  playlist.data &&
  playlist.data.tracks &&
  playlist.data.tracks.length;

export const actions = {
  changeTrack: (forward = true) => (dispatch, getState) => {
    const state = getState();
    const playlist = getSelectedPlaylist(state);
    if (!checkPlaylist(playlist)) {
      return;
    }
    const index = playlist.data.tracks.findIndex(t => t.id === state.audio.id);
    const nextIndex = index + (forward ? 1 : -1);
    if (nextIndex === playlist.data.tracks.length || nextIndex < 0) {
      return;
    }
    // Go to the next track
    dispatch({
      payload: playlist.data.tracks[nextIndex].id,
      type: types.PLAY
    });
  },
  pause: () => ({
    type: types.PAUSE
  }),
  play: id => (dispatch, getState) => {
    if (!id) {
      const state = getState();
      const playlist = getSelectedPlaylist(state);
      if (!checkPlaylist(playlist)) {
        return;
      }
      dispatch({
        payload: playlist.data.tracks[0].id,
        type: types.PLAY
      });
    } else {
      dispatch({
        payload: id,
        type: types.PLAY
      });
    }
  },
  stop: () => ({
    type: types.STOP
  }),
  trackComplete: () => (dispatch, getState) => {
    const state = getState();
    const playlist = getSelectedPlaylist(state);
    if (!checkPlaylist(playlist)) {
      return;
    }
    const index = playlist.data.tracks.findIndex(t => t.id === state.audio.id);
    let nextIndex = index + 1;
    if (nextIndex === playlist.data.tracks.length) {
      // We are at the end of the playlist
      if (state.audio.loop) {
        // Go back to the beginning if loop is set
        nextIndex = 0;
      } else {
        // Stop if loop is not set
        return dispatch({
          type: types.STOP
        });
      }
    }
    // Go to the next track
    dispatch({
      payload: playlist.data.tracks[nextIndex].id,
      type: types.PLAY
    });
  }
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.PAUSE:
      return {
        ...state,
        paused: !state.paused
      };
    case types.PLAY:
      return {
        ...state,
        id: action.payload,
        isPlaying: true,
        paused: false
      };
    case types.STOP:
      return {
        ...state,
        id: null,
        isPlaying: false,
        paused: true
      };
    default:
      return state;
  }
};
