import * as audio from './audio';
import * as auth from './auth';
import * as files from './files';
import * as playlists from './playlists';

export const reducers = {
  audio: audio.reducer,
  auth: auth.reducer,
  files: files.reducer,
  playlists: playlists.reducers
};
