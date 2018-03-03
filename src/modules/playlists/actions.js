import { FileSystem } from 'expo';
import throttle from 'lodash.throttle';
import pLimit from 'p-limit';
import {
  cleanFiles,
  createDownloader,
  getDropboxConnection,
  getFileName,
  handleError,
  isDownloaded,
  transformFile,
  uploadFile
} from '../utils';
import { getSelectedPlaylist } from './selectors';
import types from './types';

const limit = pLimit(2);

export const createPlaylist = name => async (dispatch, getState) => {
  dispatch({ type: types.PENDING });
  const state = getState();
  const path = state.files.path;
  const fileName = `${path}/${name}.mix`;
  const data = {
    title: name,
    tracks: []
  };
  try {
    const meta = await uploadFile(data, fileName, state);
    dispatch({
      payload: {
        data,
        meta
      },
      type: types.ADD_SUCCESS
    });
    return {
      data,
      meta
    };
  } catch (error) {
    handleError(error, dispatch, types.FAILED);
  }
};

export const deletePlaylist = playlist => async (dispatch, getState) => {
  dispatch({ type: types.PENDING });
  try {
    const state = getState();
    const dbx = getDropboxConnection(state);
    await dbx.filesDelete({ path: playlist.meta.path_lower });
    dispatch({
      payload: playlist.meta.id,
      type: types.DELETE_SUCCESS
    });
    // Remove local playlist file
    cleanFiles(getState);
  } catch (error) {
    handleError(error, dispatch, types.FAILED);
  }
};

export const downloadTracks = () => async (dispatch, getState) => {
  const state = getState();
  const playlist = getSelectedPlaylist(state);
  const { tracks } = playlist.data;
  if (!tracks || tracks.length === 0) {
    return;
  }
  try {
    // Create downloaders for all fo the tracks
    const trackDownloaders = tracks
      .filter(track => !track.downloadStatus || track.downloadStatus < 100)
      .map(track => {
        // Set initial progress to 0
        dispatch({
          payload: {
            id: track.id,
            progress: 0
          },
          type: types.DOWNLOAD_PROGRESS
        });
        // Create a downloader
        return createDownloader(
          getFileName(track),
          track.path_display,
          state,
          // Notify redux store of file download progress
          throttle(
            progress => dispatch(downloadProgress(track.id, progress)),
            250
          )
        );
      });
    if (trackDownloaders.some(t => t)) {
      dispatch({
        payload: true,
        type: types.UPDATE_DOWNLOADING
      });
    }
    // Download the files
    trackDownloaders.map(d => limit(() => d.downloadAsync()));
    await Promise.all(trackDownloaders);
    dispatch({
      payload: false,
      type: types.UPDATE_DOWNLOADING
    });
  } catch (error) {
    handleError(error, dispatch, types.FAILED);
  }
};

const downloadProgress = (id, progress) => (dispatch, getState) => {
  const percentComplete = Math.min(
    100,
    Math.ceil(
      progress.totalBytesWritten / progress.totalBytesExpectedToWrite * 100
    )
  );
  dispatch({
    payload: {
      id,
      progress: percentComplete
    },
    type: types.DOWNLOAD_PROGRESS
  });
};

export const findPlaylists = () => async (dispatch, getState) => {
  dispatch({ type: types.PENDING });
  const state = getState();
  try {
    const dbx = getDropboxConnection(state);
    // Search for playlist files
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
          data: {
            ...playlist,
            tracks: await Promise.all(
              (playlist.tracks || []).map(transformFile).map(isDownloaded)
            )
          },
          meta: match.metadata
        };
      })
    );
    dispatch({
      payload: playlists,
      type: types.SUCCESS
    });
  } catch (error) {
    handleError(error, dispatch, types.FAILED);
  }
};

export const savePlaylist = () => async (dispatch, getState) => {
  const state = getState();
  const playlist = getSelectedPlaylist(state);
  try {
    // Upload playlist to dropbox
    const meta = await uploadFile(
      playlist.data,
      playlist.meta.path_lower,
      state
    );
    dispatch({
      payload: meta,
      type: types.SAVE_SUCCESS
    });
  } catch (error) {
    handleError(error, dispatch, types.FAILED);
  }
};

export const selectPlaylist = id => ({
  payload: id,
  type: types.SELECT
});

export const updateTitle = title => ({
  payload: title,
  type: types.UPDATE_TITLE
});

export const updateTracks = tracks => ({
  payload: {
    hasChanges: true,
    tracks
  },
  type: types.UPDATE_TRACKS
});

export const updateTrackInfo = () => async (dispatch, getState) => {
  const state = getState();
  const playlist = getSelectedPlaylist(state);
  // If there aren't any tracks there's nothing to update so exit
  if (
    !playlist ||
    !playlist.data ||
    !playlist.data.tracks ||
    playlist.data.tracks.length === 0
  ) {
    return;
  }
  dispatch({ type: types.PENDING });
  try {
    // Connect to dropbox and update the track information
    const dbx = getDropboxConnection(state);
    const results = await Promise.all(
      playlist.data.tracks.map(track =>
        dbx.filesGetMetadata({
          path: track.id
        })
      )
    );
    const tracks = await Promise.all(
      results.map(transformFile).map(isDownloaded)
    );
    dispatch({
      payload: {
        tracks
      },
      type: types.UPDATE_TRACKS
    });
    // Remove old tracks if the list changed
    cleanFiles(getState);
  } catch (error) {
    handleError(error, dispatch, types.FAILED);
  }
};
