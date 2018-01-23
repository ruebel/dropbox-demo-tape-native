import Dropbox from 'dropbox';
import { FileSystem } from 'expo';
import { createDownloader, transformFile } from '../utils';
import { getSelectedPlaylist } from './selectors';
import types from './types';

export const downloadTracks = tracks => async (dispatch, getState) => {
  if (!tracks || tracks.length === 0) {
    return;
  }
  dispatch({
    payload: tracks,
    type: types.PENDING_FILES
  });
  try {
    const state = getState();
    // Create downloaders for all fo the tracks
    const trackDownloaders = tracks.map(track => ({
      downloader: createDownloader(
        track.name,
        track.path_display,
        state,
        progress => dispatch(downloadProgress(track.id, progress))
      ),
      track
    }));
    // Download the files
    const results = await Promise.all(
      trackDownloaders.map(t => t.download.downloadAsync())
    );
    // eslint-disable-next-line
    debugger;
    console.log(results);
  } catch (error) {
    console.error(error);
    dispatch({
      payload: { message: error.message },
      type: types.FAILED
    });
  }
};

const downloadProgress = (id, progress) => ({
  payload: { id, progress },
  type: types.DOWNLOAD_PROGRESS
});

export const findPlaylists = () => async (dispatch, getState) => {
  dispatch({ type: types.PENDING });
  const state = getState();
  try {
    const dbx = new Dropbox({
      accessToken: state.auth.user.params.access_token
    });
    const { matches } = await dbx.filesSearch({
      path: '',
      query: '.mix'
    });
    const playlists = await Promise.all(
      matches.map(async match => {
        // Create a downloader
        const downloader = createDownloader(
          match.metadata.name,
          match.metadata.path_display,
          state
        );
        // Download the file
        const result = await downloader.downloadAsync();
        // Read it back from storage as a string
        const fileString = await FileSystem.readAsStringAsync(result.uri);
        // Parse to JSON
        const playlist = JSON.parse(fileString);
        // Combine w/ metadata and return
        return {
          data: playlist,
          meta: match.metadata
        };
      })
    );
    dispatch({
      payload: playlists,
      type: types.SUCCESS
    });
  } catch (error) {
    console.error(error);
    dispatch({
      payload: { message: error.message },
      type: types.FAILED
    });
  }
};

export const selectPlaylist = id => ({
  payload: id,
  type: types.SELECT
});

export const updateTracks = tracks => ({
  payload: tracks,
  type: types.UPDATE_TRACKS
});

export const updateTrackInfo = () => async (dispatch, getState) => {
  dispatch({ type: types.PENDING });
  const state = getState();
  try {
    const dbx = new Dropbox({
      accessToken: state.auth.user.params.access_token
    });
    const playlist = getSelectedPlaylist(state);
    if (!playlist || !playlist.tracks || playlist.tracks.length === 0) {
      return;
    }
    const results = await Promise.all(
      playlist.tracks.map(track =>
        dbx.filesGetMetadata({
          path: track.id
        })
      )
    );
    dispatch({
      payload: results.map(transformFile),
      type: types.UPDATE_TRACKS
    });
  } catch (error) {
    console.error(error);
    dispatch({
      payload: { message: error.message },
      type: types.FAILED
    });
  }
};
