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

/**
 * Ensures playlist has tracks associated with it
 * @param  {Object} playlist Playlist object
 * @return {Boolean}          Has Tracks
 */
const playlistHasTracks = playlist =>
  playlist &&
  playlist.data &&
  playlist.data.tracks &&
  playlist.data.tracks.length;

export const actions = {
  /**
   * Play next / previous track
   * @param  {Boolean} [forward=true] Next if true (previous is false)
   */
  changeTrack: (forward = true) => (dispatch, getState) => {
    const state = getState();
    const playlist = getSelectedPlaylist(state);
    if (!playlistHasTracks(playlist)) {
      // This playlist doesn't have tracks to return
      return;
    }
    // Get current track index
    const index = playlist.data.tracks.findIndex(t => t.id === state.audio.id);
    // Calcualte next index
    const nextIndex = index + (forward ? 1 : -1);
    if (nextIndex === playlist.data.tracks.length || nextIndex < 0) {
      // Next track would be past the end or before the 1st track so bail
      return;
    }
    // Go to the next track
    dispatch({
      payload: playlist.data.tracks[nextIndex].id,
      type: types.PLAY
    });
  },
  /**
   * Pause playback
   */
  pause: () => ({
    type: types.PAUSE
  }),
  /**
   * Start playback
   * @param  {String} id Playlist id
   */
  play: id => (dispatch, getState) => {
    if (!id) {
      const state = getState();
      const playlist = getSelectedPlaylist(state);
      if (!playlistHasTracks(playlist)) {
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
  /**
   * Stop playback
   */
  stop: () => ({
    type: types.STOP
  }),
  /**
   * Handle when a track has completed playing
   */
  trackComplete: () => (dispatch, getState) => {
    const state = getState();
    const playlist = getSelectedPlaylist(state);
    if (!playlistHasTracks(playlist)) {
      return;
    }
    // Get index of current track
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
