import types from './types';

const initialState = {
  data: [],
  error: null,
  pending: false,
  pendingFiles: [],
  selectedId: null
};

const updateById = (id, items, update) =>
  items.map(item => (item.data.id === id ? update(item) : item));

const updateSelected = (state, update) => ({
  ...state,
  data: updateById(state.selectedId, state.data, update),
  pending: false
});

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FAILED:
      return {
        ...state,
        data: [],
        error: action.payload,
        pending: false
      };
    case types.PENDING:
      return {
        ...state,
        error: null,
        pending: true
      };
    case types.PENDING_FILES:
      return {
        ...state,
        pendingFiles: updateById(
          action.payload.id,
          state.pendingFiles,
          () => action.payload.progress
        )
      };
    case types.SELECT:
      return {
        ...state,
        selectedId: action.payload
      };
    case types.SUCCESS:
      return {
        ...state,
        data: action.payload,
        error: null,
        pending: false
      };
    case types.UPDATE_TRACKS:
      return updateSelected(state, playlist => ({
        ...playlist,
        data: {
          ...playlist.data,
          tracks: action.payload
        }
      }));
    default:
      return state;
  }
};
