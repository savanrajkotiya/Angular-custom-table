import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '@app/app-reducer';
import * as Users from '@store/users/users.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  allColumns = [
    { id: 'id', name: 'ID', sortable: true, sortDir: 'desc' },
    { id: 'name', name: 'Name', sortable: true, sortDir: 'desc' },
    { id: 'username', name: 'Username', sortable: true, sortDir: 'desc' },
    { id: 'email', name: 'Email', sortable: true, sortDir: 'desc' },
    { id: 'phone', name: 'Phone', sortable: true, sortDir: 'desc' },
  ];

  tableData: [] = [];

  subscription: Subscription = new Subscription();

  constructor(private $store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.$store.dispatch(new Users.LoadUsersList());
    this.subscription.add(
      this.$store.select('users').subscribe((data: any) => {
        this.tableData = data.users;
      }),
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
