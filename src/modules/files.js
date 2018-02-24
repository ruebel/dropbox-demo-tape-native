import { get } from 'dot-prop';
import {
  getDropboxConnection,
  handleError,
  isFolderOrAudioFile,
  transformAccount,
  transformFile
} from './utils';

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

const getUsers = (users = []) => async (dispatch, getState) => {
  const state = getState();
  const existingUsers = state.files.users;
  const usersToFetch = users.filter(
    user => !existingUsers.some(u => u.account_id === user)
  );
  if (!usersToFetch.length) {
    return;
  }
  try {
    const dbx = getDropboxConnection(state);
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
  getFiles: (folder = '') => async (dispatch, getState) => {
    dispatch({ type: types.PENDING });
    const state = getState();
    try {
      const dbx = getDropboxConnection(state);
      const { cursor, entries, hasMore } = await dbx.filesListFolder({
        path: folder
      });
      const payload = {
        cursor,
        data: entries.filter(isFolderOrAudioFile).map(transformFile),
        hasMore,
        path: folder
      };
      const users = [
        ...new Set(
          payload.data.map(entry => get(entry, 'sharing_info.modified_by'))
        )
      ].filter(u => u);
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
    ? b.type === 'folder' ? 1 : -1
    : a.name.localeCompare(b.name);

const sortByTypeAndModified = (a, b) =>
  a.type !== b.type && (a.type === 'folder' || b.type === 'folder')
    ? b.type === 'folder' ? 1 : -1
    : new Date(b.server_modified) - new Date(a.server_modified);

export const selectors = {
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
