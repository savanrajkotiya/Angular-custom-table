import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  allColumns = [
    { id: '_id', name: 'Id', sortable: true, sortDir: 'desc' },
    { id: 'firstName', name: 'First Name', sortable: true, sortDir: 'desc' },
    { id: 'lastName', name: 'Last Name', sortable: true, sortDir: 'desc' },
    { id: 'Address', name: 'Address', sortable: true, sortDir: 'desc' },
    { id: 'street', name: 'Street', sortable: true, sortDir: 'desc' },
    { id: 'city', name: 'City', sortable: true, sortDir: 'desc' },
    { id: 'state', name: 'State', sortable: true, sortDir: 'desc' },
  ];

  tableData = [
    {
      _id: '1',
      firstName: 'Becker',
      lastName: 'Glenn',
      Address: 626,
      street: 'Keap Street',
      city: 'Oceola',
      state: 'Tennessee',
    },
    {
      _id: '2',
      firstName: 'Kellie',
      lastName: 'Moody',
      Address: 426,
      street: 'Windsor Place',
      city: 'Condon',
      state: 'Minnesota',
    },
  ];
}
