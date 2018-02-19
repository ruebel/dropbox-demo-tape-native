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
  users: []
};

export const types = {
  FAILED: `${prefix}/FAILED`,
  PENDING: `${prefix}/PENDING`,
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
  getUsers
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
