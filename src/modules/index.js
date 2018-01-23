import * as auth from './auth';
import * as files from './files';
import * as playlists from './playlists';

export const reducers = {
  auth: auth.reducer,
  files: files.reducer,
  playlists: playlists.reducers
};
