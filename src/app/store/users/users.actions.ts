import { Action } from '@ngrx/store';

export const LOAD_USERS = '[Users List] Load User List';
export const LOAD_USERS_SUCCESS = '[Users List] Load Success';
export const USERS_START_LOADING = '[Users] Users Start Loading';
export const USERS_STOP_LOADING = '[Users] Users Stop Loading';

export class UserStartLoading implements Action {
  readonly type = USERS_START_LOADING;
}

export class UserStopLoading implements Action {
  readonly type = USERS_STOP_LOADING;
}

export class LoadUsersList implements Action {
  readonly type = LOAD_USERS;
}

export class LoadUsersListSuccess implements Action {
  readonly type = LOAD_USERS_SUCCESS;
  constructor(public payload: any) {}
}

export type UsersActions = UserStartLoading | UserStopLoading | LoadUsersList | LoadUsersListSuccess;
