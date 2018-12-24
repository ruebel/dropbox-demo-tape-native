import {
  getDropboxConnection,
  getModifiedBy,
  getModifiedUsersFromEntries,
  handleError,
  isFileOrFolder,
  transformAccount,
  transformFile
} from './utils';

import { selectors as playlistSelectors } from './playlists';

const prefix = 'FILES';

const initialState = {
  cursor: null,
  data: [],
  error: null,
  hasMore: false,
  path: '',
  pending: true,
  sortBy: 'modified',
  users: []
};

export const types = {
  FAILED: `${prefix}/FAILED`,
  PENDING: `${prefix}/PENDING`,
  SORT_BY: `${prefix}/SORT_BY`,
  SUCCESS: `${prefix}/SUCCESS`,
  USERS_SUCCESS: `${prefix}/USERS_SUCCESS`
};

/**
 * Gets user info (from cache or dropbox) of users in array
 * @param  {Array}  [users=[]] Users to get info on
 */
const getUsers = (users = []) => async (dispatch, getState) => {
  const state = getState();
  // These are users we already have info on
  const existingUsers = state.files.users;
  // Filter users down to users we don't already have info on
  const usersToFetch = users.filter(
    user => !existingUsers.some(u => u.account_id === user)
  );
  // If we already have everybody's info return
  if (!usersToFetch.length) {
    return;
  }
  try {
    const dbx = getDropboxConnection(state);
    // Get user info of all unknown users
    const results = await dbx.usersGetAccountBatch({
      /* eslint-disable camelcase */
      account_ids: usersToFetch
    });
    dispatch({
      payload: results.map(transformAccount),
      type: types.USERS_SUCCESS
    });
  } catch (error) {
    handleError(error, dispatch, types.FAILED);
  }
};

export const actions = {
  /**
   * Get file listing for dropbox folder
   * @param  {String} [folder=''] Folder path
   */
  getFiles: (folder = '') => async (dispatch, getState) => {
    dispatch({ type: types.PENDING });
    const state = getState();
    try {
      const dbx = getDropboxConnection(state);
      // Get folder listing
      const { cursor, entries, hasMore } = await dbx.filesListFolder({
        path: folder
      });
      const payload = {
        cursor,
        data: entries.filter(isFileOrFolder).map(transformFile),
        hasMore,
        path: folder
      };
      // Get all user ids of users who have modified listed files
      const users = getModifiedUsersFromEntries(payload.data);
      // Get user info for all users that have modified files
      dispatch(getUsers(users));
      dispatch({
        payload,
        type: types.SUCCESS
      });
    } catch (error) {
      handleError(error, dispatch, types.FAILED);
    }
  },
  getUsers,
  setSortBy: sortBy => ({
    payload: sortBy,
    type: types.SORT_BY
  })
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FAILED:
      return {
        ...state,
        data: null,
        error: action.payload,
        pending: false
      };
    case types.PENDING:
      return {
        ...state,
        error: null,
        pending: true
      };
    case types.SORT_BY:
      return {
        ...state,
        sortBy: action.payload
      };
    case types.SUCCESS:
      return {
        ...state,
        ...action.payload,
        error: null,
        pending: false
      };
    case types.USERS_SUCCESS:
      return {
        ...state,
        users: [...(state.users || []), ...(action.payload || [])]
      };
    default:
      return state;
  }
};

const sortByTypeAndName = (a, b) =>
  a.type !== b.type && (a.type === 'folder' || b.type === 'folder')
    ? b.type === 'folder'
      ? 1
      : -1
    : a.name.localeCompare(b.name);

const sortByTypeAndModified = (a, b) =>
  a.type !== b.type && (a.type === 'folder' || b.type === 'folder')
    ? b.type === 'folder'
      ? 1
      : -1
    : new Date(b.server_modified) - new Date(a.server_modified);

export const selectors = {
  getCurrentPlaylistModifiedUser: state => {
    const playlist = playlistSelectors.getSelectedPlaylist(state);
    const users = state.files.users;

    if (playlist && users.length > 0) {
      const modifiedById = getModifiedBy(playlist.meta);
      return users.find(user => user.id === modifiedById);
    }
    return null;
  },
  getSortedFiles: state => {
    switch (state.files.sortBy) {
      case 'modified':
      default:
        return state.files.data.sort(sortByTypeAndModified);
      case 'name':
        return state.files.data.sort(sortByTypeAndName);
    }
  }
};
