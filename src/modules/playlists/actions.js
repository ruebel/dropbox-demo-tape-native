import { FileSystem } from 'expo';
import throttle from 'lodash.throttle';
import {
  createDownloader,
  getDropboxConnection,
  getFileName,
  handleError,
  isDownloaded,
  transformFile
} from '../utils';
import { getSelectedPlaylist } from './selectors';
import types from './types';

export const downloadTracks = () => async (dispatch, getState) => {
  const state = getState();
  const playlist = getSelectedPlaylist(state);
  const { tracks } = playlist.data;
  if (!tracks || tracks.length === 0) {
    return;
  }
  try {
    // Create downloaders for all fo the tracks
    const trackDownloaders = tracks.map(track =>
      createDownloader(
        getFileName(track),
        track.path_display,
        state,
        // Notify redux store of file download progress
        throttle(
          progress => dispatch(downloadProgress(track.id, progress)),
          250
        )
      )
    );
    // Download the files
    const results = await Promise.all(
      trackDownloaders.map(d => d.downloadAsync())
    );
    console.log(results);
  } catch (error) {
    handleError(error, dispatch, types.FAILED);
  }
};

const downloadProgress = (id, progress) => ({
  payload: {
    id,
    progress: Math.ceil(
      progress.totalBytesWritten / progress.totalBytesExpectedToWrite * 100
    )
  },
  type: types.DOWNLOAD_PROGRESS
});

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
    handleError(error, dispatch, types.FAILED);
  }
};

export const savePlaylist = () => async (dispatch, getState) => {
  const state = getState();
  const playlist = getSelectedPlaylist(state);
  try {
    const dbx = getDropboxConnection(state);
    // Upload playlist to dropbox (dropbox will return new metadata)
    const meta = await dbx.filesUpload({
      // Do not rename on conflict
      autorename: false,
      // File data to upload
      contents: JSON.stringify(playlist.data),
      // Overwrite previous version of file (if exists)
      mode: {
        '.tag': 'overwrite'
      },
      // Do not notify users of change
      mute: true,
      // Path to file in dropbox
      path: playlist.meta.path_lower
    });
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
  } catch (error) {
    handleError(error, dispatch, types.FAILED);
  }
};
