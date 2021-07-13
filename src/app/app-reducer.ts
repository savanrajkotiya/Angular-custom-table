import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromUser from '@store/users/users.reducer';

export interface State {
  users: fromUser.State;
}

export const reducers: ActionReducerMap<State> = {
  users: fromUser.UsersReducer,
};

/* users states  */
export const getUsersState = createFeatureSelector<fromUser.State>('users');
