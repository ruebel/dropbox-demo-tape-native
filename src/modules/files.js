import {
  getDropboxConnection,
  handleError,
  isFolderOrAudioFile,
  transformFile
} from './utils';

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
      dispatch({
        payload,
        type: types.SUCCESS
      });
    } catch (error) {
      handleError(error, dispatch, types.FAILED);
    }
  }
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
    default:
      return state;
  }
};
