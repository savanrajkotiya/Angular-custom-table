import { Component, OnInit, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDragRelease } from '@angular/cdk/drag-drop';

import { DataTable } from '@constants/data-table.constants';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  // #region Input and output variables
  @Input()
  Id!: string;
  @Input()
  collection: any[];
  @Input()
  defaultColumns = [];
  @Input()
  allColumns = [];
  @Output()
  rowClick = new EventEmitter<{ event: string; value: any }>();
  @Input()
  isSorting: boolean = true;
  @Input()
  isSearchable: boolean = true;
  @Input()
  trackByKey: string = '';
  // #endregion

  // #region local variables and functions
  DataTable = DataTable;

  selectedColumns = [];
  showSorting = true;
  pos: any;
  release: boolean = true;
  searchText: string = '';

  // #endregion

  constructor(private renderer2: Renderer2) {}

  ngOnInit() {
    if (!this.isSorting && this.isSorting !== undefined) {
      this.showSorting = false;
    }
    this.setColumnFilter();
  }

  // #region other functions

  collectionTrackBy(index, item) {
    if (this.trackByKey) {
      return item[this.trackByKey];
    } else {
      return index;
    }
  }

  dropRow(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.collection, event.previousIndex, event.currentIndex);
  }

  dropCol(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedColumns, event.previousIndex, event.currentIndex);
  }

  mouseDown(event, el: HTMLElement = null) {
    el = el || event.target;
    this.pos = {
      x: el.getBoundingClientRect().left - event.clientX + 'px',
      y: el.getBoundingClientRect().top - event.clientY + 'px',
      width: el.getBoundingClientRect().width + 'px',
    };
  }

  onDragRelease(event: CdkDragRelease) {
    this.renderer2.setStyle(event.source.element.nativeElement, 'margin-left', '0px');
  }

  setColumnFilter(): void {
    this.selectedColumns = [];
    this.defaultColumns.map((object: object) => {
      this.selectedColumns.push(object);
    });
  }

  onSortingChanged(column: Object) {
    if (!column['sortable']) {
      return;
    }
    let sortDirection;
    if (column['sortDir'] === 'asc') {
      sortDirection = 'desc' as const;
    } else {
      sortDirection = 'asc' as const;
    }
    column['sortDir'] = sortDirection;
    this.collection = this.collection.slice().sort(this.orderBy([column['id']], [sortDirection]));
  }

  orderBy(keys, orders) {
    let cb: any = () => 0;
    keys.reverse();
    orders.reverse();
    for (const [i, key] of keys.entries()) {
      const order = orders[i];
      if (order == 'asc') {
        cb = this.sortBy(key, cb);
      } else if (order == 'desc') {
        cb = this.sortByDesc(key, cb);
      } else {
        throw new Error(`Unsupported order "${order}"`);
      }
    }
    return cb;
  }

  sortByDesc(key, cb) {
    if (!cb) cb = () => 0;
    return (b, a) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : cb(b, a));
  }

  sortBy(key, cb) {
    if (!cb) cb = () => 0;
    return (a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : cb(a, b));
  }

  rowClicked(data: object) {
    if (data) {
      this.rowClick.emit({ event: 'rowClick', value: data });
    }
  }
  // #endregion
}
