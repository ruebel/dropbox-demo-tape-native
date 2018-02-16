import { getSelectedPlaylist } from './playlists/selectors';

const prefix = 'AUDIO';

const initialState = {
  index: 0,
  isPlaying: false,
  loop: false,
  paused: false
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
    const nextIndex = state.audio.index + (forward ? 1 : -1);
    if (nextIndex === playlist.data.tracks.length || nextIndex < 0) {
      return;
    }
    // Go to the next track
    dispatch({
      payload: nextIndex,
      type: types.PLAY
    });
  },
  pause: () => ({
    type: types.PAUSE
  }),
  play: (index = 0) => ({
    payload: index,
    type: types.PLAY
  }),
  stop: () => ({
    type: types.STOP
  }),
  trackComplete: () => (dispatch, getState) => {
    const state = getState();
    const playlist = getSelectedPlaylist(state);
    if (!checkPlaylist(playlist)) {
      return;
    }
    let nextIndex = state.audio.index + 1;
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
      payload: nextIndex,
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
        index: action.payload,
        isPlaying: true
      };
    case types.STOP:
      return {
        ...state,
        isPlaying: false
      };
    default:
      return state;
  }
};
