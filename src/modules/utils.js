import Dropbox from 'dropbox';
import { FileSystem } from 'expo';

// Dropbox public download API URL
const dropBoxDownloadUrl = 'https://content.dropboxapi.com/2/files/download';

/**
 * Create a resumable downloader with proper headers
 * @param  {String} local  Local path to save file
 * @param  {String} remote Remote location to download from
 * @param  {Object} state  Current app state
 * @param  {Func} progress  Current app state
 * @return {Object}        Resumable Downloader Object
 */
export const createDownloader = (local, remote, state, progress) => {
  const localPath = FileSystem.documentDirectory + local;
  // Since the dropbox SDK only supports downloading as Blobs and RN
  // doesn't have support for blobs at the moment I am using the
  // Expo FileSystem Resumable Downloader to download the file
  // (the regular downloader doesn't support headers)
  return FileSystem.createDownloadResumable(
    dropBoxDownloadUrl,
    localPath,
    {
      headers: {
        Authorization: 'Bearer ' + state.auth.user.params.access_token,
        'Dropbox-API-Arg': JSON.stringify({
          path: remote
        })
      }
    },
    progress
  );
};

export const uploadFile = async (data, path, state) => {
  const dbx = getDropboxConnection(state);
  // Upload playlist to dropbox (dropbox will return new metadata)
  const meta = await dbx.filesUpload({
    // Do not rename on conflict
    autorename: false,
    // File data to upload
    contents: JSON.stringify(data),
    // Overwrite previous version of file (if exists)
    mode: {
      '.tag': 'overwrite'
    },
    // Do not notify users of change
    mute: true,
    // Path to file in dropbox
    path
  });
  return meta;
};

/**
 * Returns a dropbox sdk instance using state credentials
 * @param  {Object} state App state
 * @return {Object}       Connected dropbox SDK instance
 */
export const getDropboxConnection = state =>
  new Dropbox({
    accessToken: state.auth.user.params.access_token
  });

export const getFileName = track => `${track.id}-${track.rev}.mp3`;

export const getFilePath = track =>
  `${FileSystem.documentDirectory}${getFileName(track)}`;

/**
 * Generic error handler
 * @param  {Object} error    Caught error object
 * @param  {Func} dispatch   Redux dispatch fn
 * @param  {String} type     Redux action type
 */
export const handleError = (error, dispatch, type) => {
  console.error(error);
  dispatch({
    payload: { message: error.message },
    type: type
  });
};

export const isDownloaded = async track => {
  const info = await FileSystem.getInfoAsync(getFilePath(track));
  return {
    ...track,
    downloadStatus: info.exists ? 100 : null
  };
};

/**
 * Transform dropbox file object shape to shape usable by client
 * @param  {Object} file File object shape from dropbox
 * @return {Object}      Transformed file object
 */
export const transformFile = file => ({
  ...file,
  path: file.path_display,
  type: file['.tag']
});
