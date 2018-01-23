import Dropbox from 'dropbox';
import { transformFile } from './utils';

const prefix = 'FILES';

const initialState = {
  cursor: null,
  data: [],
  error: null,
  hasMore: false,
  path: '',
  pending: true
};

export const types = {
  FAILED: `${prefix}/FAILED`,
  PENDING: `${prefix}/PENDING`,
  SUCCESS: `${prefix}/SUCCESS`
};

export const actions = {
  getFiles: (folder = '') => async (dispatch, getState) => {
    dispatch({ type: types.PENDING });
    const state = getState();
    try {
      const dbx = new Dropbox({
        accessToken: state.auth.user.params.access_token
      });
      const { cursor, entries, hasMore } = await dbx.filesListFolder({
        path: folder
      });
      const payload = {
        cursor,
        data: entries.map(transformFile),
        hasMore,
        path: folder
      };
      dispatch({
        type: types.SUCCESS,
        payload
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: types.FAILED,
        payload: { message: error.message }
      });
    }
  }
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FAILED:
      return {
        ...state,
        error: action.payload,
        pending: false,
        data: null
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
    default:
      return state;
  }
};
