import Dropbox from 'dropbox';
import { FileSystem } from 'expo';
import { get } from 'dot-prop';

// Dropbox public download API URL
const dropBoxDownloadUrl = 'https://content.dropboxapi.com/2/files/download';

/**
 * Deletes files that are no longer in active use by app
 * @param  {Func}  getState Func that returns current app state
 */
export const cleanFiles = async getState => {
  const docPath = FileSystem.documentDirectory;
  // Get all files in the doc directory
  const files = await FileSystem.readDirectoryAsync(docPath);
  // Get current app state / playlist data
  const state = getState();
  const playlists = state.playlists.data;
  // Create a list of active files (playlists and their track files)
  const activeFiles = playlists.reduce(
    (all, p) => [
      ...all,
      createValidFileURI(p.meta.name),
      ...p.data.tracks.map(getFileName)
    ],
    []
  );
  // Delete inactive files
  files
    .filter(f => (isPlaylist(f) || isAudioFile(f)) && !activeFiles.includes(f))
    .map(f => FileSystem.deleteAsync(docPath + f));
};

/**
 * Create a resumable downloader with proper headers
 * @param  {String} local  Local path to save file
 * @param  {String} remote Remote location to download from
 * @param  {Object} state  Current app state
 * @param  {Func} progress  Current app state
 * @return {Object}        Resumable Downloader Object
 */
export const createDownloader = (local, remote, state, progress) => {
  const localPath = FileSystem.documentDirectory + createValidFileURI(local);
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

/**
 * Remove invalid characters from file path
 * @param  {String} path File URI
 * @return {String}      Valid File URI
 */
const createValidFileURI = path =>
  path
    .split('-')
    .join('_')
    .split(' ')
    .join('_')
    .trim();

/**
 * Upload a file to dropbox
 * @param  {Object}  data  File data to upload
 * @param  {String}  path  Dropbox path to file
 * @param  {Object}  state App state
 * @return {Promise}       Upload result
 */
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

/**
 * Get extension from file name
 * @param  {String} name File Name
 * @return {String}      Extension
 */
const getExtension = name => name.split('.').pop();

/**
 * Createa file name from a track
 * @param  {Object} track Track object
 * @return {String}       File Name
 */
export const getFileName = track =>
  track ? `${track.id}-${track.rev}.${getExtension(track.name)}` : null;

/**
 * Get the download file path of a track
 * @param  {Object} track Track Object
 * @return {String}       File Path
 */
export const getFilePath = track =>
  track
    ? `${FileSystem.documentDirectory}${createValidFileURI(getFileName(track))}`
    : null;

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
 * Returns true if file name is an audio file
 * @param  {String}  name File Name
 * @return {Boolean}      isAudioFile
 */
const isAudioFile = name => {
  return ['mp3', 'm4a', 'ovw', 'wav'].includes(getExtension(name));
};

/**
 * Add download status property to track
 * @param  {Object}  track
 */
export const isDownloaded = async track => {
  const info = await FileSystem.getInfoAsync(getFilePath(track));
  return {
    ...track,
    downloadStatus: info.exists ? 100 : null
  };
};

/**
 * Return true if entry is a folder or an audio file
 * @param  {Object}  entry Dropbox entry
 * @return {Boolean}       isFolderOrAudioFile
 */
export const isFolderOrAudioFile = entry =>
  entry['.tag'] === 'folder' ||
  (entry['.tag'] === 'file' && isAudioFile(entry.name));

/**
 * Returns true if file name is a demo tape playlist
 * @param  {String}  name File Name
 * @return {Boolean}      is playlist
 */
const isPlaylist = name => {
  return getExtension(name) === 'mix';
};

/**
 * Transform dropbox account object to shape usable by client
 * @param  {Object} account Dropbox account object
 * @return {Object}         Transformed account object
 */
export const transformAccount = account => ({
  ...account,
  id: account.account_id,
  name: {
    abbreviated: account.name.abbreviated_name,
    full: account.name.display_name
  }
});

/**
 * Transform dropbox file object shape to shape usable by client
 * @param  {Object} file File object shape from dropbox
 * @return {Object}      Transformed file object
 */
export const transformFile = file => ({
  ...file,
  path: file.path_display,
  type: file['.tag'],
  user: get(file, 'sharing_info.modified_by')
});
