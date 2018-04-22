import { get } from 'dot-prop';
const prefix = 'AUTH';

const initialState = {
  error: null,
  pending: true,
  user: null
};

export const types = {
  FAILED: `${prefix}/FAILED`,
  LOGOUT: `${prefix}/LOGOUT`,
  PENDING: `${prefix}/PENDING`,
  SUCCESS: `${prefix}/SUCCESS`
};

export const actions = {
  logout: () => ({
    type: types.LOGOUT
  }),
  setUser: token => ({
    payload: token,
    type: types.SUCCESS
  })
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FAILED:
      return {
        ...state,
        error: action.payload,
        pending: false,
        user: null
      };
    case types.LOGOUT:
      return {
        ...state,
        error: null,
        pending: false,
        user: null
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
        error: null,
        pending: false,
        user: action.payload
      };
    default:
      return state;
  }
};

export const selectors = {
  getCurrentUser: state => {
    const userId = get(state, 'auth.user.params.account_id');
    if (userId) {
      return state.files.users.find(u => u.account_id === userId);
    }
    return null;
  }
};
