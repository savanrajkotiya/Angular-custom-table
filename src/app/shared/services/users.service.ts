import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { usersData } from '@shared/data/users';

@Injectable()
export class UsersService {
  /** Get Users */
  getUsers() {
    return of({
      status: 1,
      data: usersData,
    });
  }
}
