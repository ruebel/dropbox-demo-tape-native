import { FileSystem } from 'expo';

const dropBoxDownloadUrl = 'https://content.dropboxapi.com/2/files/download';

export const transformFile = file => ({
  ...file,
  path: file.path_display,
  type: file['.tag']
});
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
