import { UsersActions, LOAD_USERS, LOAD_USERS_SUCCESS, USERS_START_LOADING, USERS_STOP_LOADING } from './users.actions';

export interface State {
  users: Array<[]>;
  loading: boolean;
}

const initialState = {
  users: [],
  loading: false,
};

export function UsersReducer(state = initialState, action: UsersActions) {
  switch (action.type) {
    case LOAD_USERS:
      return state;
    case LOAD_USERS_SUCCESS:
      return { ...state, users: action.payload };
    case USERS_START_LOADING:
      return { ...state, loading: true };
    case USERS_STOP_LOADING:
      return { ...state, loading: false };
    default: {
      return state;
    }
  }
}
