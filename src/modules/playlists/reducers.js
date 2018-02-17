import types from './types';

const initialState = {
  data: [],
  error: null,
  pending: false,
  selectedId: null
};

const updateById = (id, items, update) =>
  items.map(item => (item.meta.id === id ? update(item) : item));

const updateSelected = (state, update) => ({
  ...state,
  data: updateById(state.selectedId, state.data, update),
  pending: false
});

const updateTrackById = (id, items, update) =>
  items.map(item => (item.id === id ? update(item) : item));

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_SUCCESS:
      return {
        ...state,
        data: [...state.data, action.payload],
        error: null,
        pending: false,
        selectedId: action.payload.meta.id
      };
    case types.DELETE_SUCCESS:
      return {
        ...state,
        data: state.data.filter(p => p.meta.id !== action.payload),
        error: null,
        pending: false,
        selectedId:
          state.selectedId === action.payload ? null : state.selectedId
      };
    case types.DOWNLOAD_PROGRESS:
      return updateSelected(state, playlist => ({
        ...playlist,
        data: {
          ...playlist.data,
          tracks: updateTrackById(
            action.payload.id,
            playlist.data.tracks,
            track => ({
              ...track,
              downloadStatus: action.payload.progress
            })
          )
        }
      }));
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
    case types.SAVE_SUCCESS:
      return updateSelected(state, playlist => ({
        ...playlist,
        hasChanges: false,
        meta: action.payload
      }));
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
    case types.UPDATE_TITLE:
      return updateSelected(state, playlist => ({
        ...playlist,
        data: {
          ...playlist.data,
          title: action.payload
        },
        hasChanges: true
      }));
    case types.UPDATE_TRACKS:
      return updateSelected(state, playlist => ({
        ...playlist,
        data: {
          ...playlist.data,
          tracks: action.payload.tracks
        },
        hasChanges: action.payload.hasChanges || playlist.hasChanges,
        pending: false
      }));
    default:
      return state;
  }
};
