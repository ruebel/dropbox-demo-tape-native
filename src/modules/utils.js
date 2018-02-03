import Dropbox from 'dropbox';
import { FileSystem } from 'expo';

// Dropbox public download API URL
const dropBoxDownloadUrl = 'https://content.dropboxapi.com/2/files/download';

/**
 * Create a resumable downloader with proper headers
 * @param  {String} local  Local path to save file
 * @param  {String} remote Remote location to download from
 * @param  {Object} state  Current app state
 * @return {Object}        Resumable Downloader Object
 */
export const createDownloader = (local, remote, state) =>
  // Since the dropbox SDK only supports downloading as Blobs and RN
  // doesn't have support for blobs at the moment I am using the
  // Expo FileSystem Resumable Downloader to download the file
  // (the regular downloader doesn't support headers)
  FileSystem.createDownloadResumable(
    dropBoxDownloadUrl,
    FileSystem.documentDirectory + local,
    {
      headers: {
        Authorization: 'Bearer ' + state.auth.user.params.access_token,
        'Dropbox-API-Arg': JSON.stringify({
          path: remote
        })
      }
    }
  );

/**
 * Returns a dropbox sdk instance using state credentials
 * @param  {Object} state App state
 * @return {Object}       Connected dropbox SDK instance
 */
export const getDropboxConnection = state =>
  new Dropbox({
    accessToken: state.auth.user.params.access_token
  });

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
