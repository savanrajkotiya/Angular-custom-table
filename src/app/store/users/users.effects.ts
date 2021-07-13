import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import * as fromRoot from '@app/app-reducer';
import * as Users from '@store/users/users.actions';
import { Store } from '@ngrx/store';
import { UsersService } from '@app/shared/services/users.service';
import { EMPTY } from 'rxjs';

@Injectable()
export class UsersEffects {
  constructor(private actions$: Actions, private usersService: UsersService, private store: Store<fromRoot.State>) {}

  loadUsersListSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(Users.LOAD_USERS),
      tap(() => this.store.dispatch(new Users.UserStartLoading())),
      switchMap(() =>
        this.usersService.getUsers().pipe(
          map((response: any) => new Users.LoadUsersListSuccess(response.data)),
          tap(() => this.store.dispatch(new Users.UserStopLoading())),
          catchError(() => {
            this.store.dispatch(new Users.UserStopLoading());
            return EMPTY;
          }),
        ),
      ),
      take(1),
    );
  });
}
