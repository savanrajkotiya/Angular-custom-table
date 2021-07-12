import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import {CdkDragDrop, moveItemInArray, CdkDragStart, CdkDragRelease} from '@angular/cdk/drag-drop';
import { FormGroup } from '@angular/forms';

import { forEach, concat, orderBy } from 'lodash';

import { DataTable, showEntriesList } from '@constants/data-table.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  // #region Input and output variables
  // #region Input and output variables
  @Input()
  Id!: string;
  @Input()
  collection: any[];
  @Input()
  defaultColumns = [];
  @Input()
  allColumns = [];
  @Input()
  nextLabel!: string;
  @Input()
  previousLabel!: string;
  @Output()
  rowClick = new EventEmitter<{ event: string; value: any }>();
  @Output()
  rowCheck = new EventEmitter<{ event: string; value: any }>();
  @Output()
  rowHover = new EventEmitter<{ event: string; value: any }>();
  @Output()
  exportCSV = new EventEmitter<any>();
  @Input()
  isBackButton: boolean = false;
  @Input()
  isSorting: boolean = true;
  @Input()
  defaultRecords: any;
  @Input()
  isHover: boolean = false;
  // #endregion

  // #region local variables and functions
  DataTable = DataTable;
  showEntries = {
    list: showEntriesList,
    displayValue: 'name',
    placeholder: '',
    returnValue: 'id',
    name: 'showEntries',
    listDefaultText: 'All',
    allowDefaultValue: false,
    class: 'custom-select',
    defaultValue: showEntriesList[2],
  };
  total!: number;
  recordStartValue!: number;
  recordEndValue!: number;
  dataTableForm!: FormGroup;
  itemsPerPage!: number;
  currentPage!: number;
  columnFilterSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    allowSearchFilter: true,
    itemsShowLimit: 0,
  };
  selectedColumns = [];
  showPanel = true;
  showBackButton = true;
  showSorting = true;
  checkboxChecked = true;
  pos:any;
  release:boolean = true;

  // #endregion

  constructor(private renderer2: Renderer2, private router: Router) {}

  ngOnInit() {
    if (!this.isBackButton && this.isBackButton !== undefined) {
      this.showBackButton = false;
    }
    if (!this.isSorting && this.isSorting !== undefined) {
      this.showSorting = false;
    }
    this.setColumnFilter();
    this.setDefaultValues();
    let localCurrentPage = localStorage.getItem('search-form-current-page');
    let localShowEntries = localStorage.getItem('search-form-show-entries');
    if (
      localCurrentPage !== undefined &&
      localCurrentPage !== null &&
      localShowEntries !== undefined &&
      localShowEntries !== null
    ) {
      this.currentPage = Number(localCurrentPage);
      let localShowEntriesObject = JSON.parse(localShowEntries);
      this.showEntries.defaultValue = localShowEntriesObject;
      this.dataTableForm.controls['showEntries'].setValue(localShowEntriesObject);
      this.itemsPerPage = Number(localShowEntriesObject.id);
      this.setRecordData(this.currentPage);
      localStorage.removeItem('search-form-current-page');
      localStorage.removeItem('search-form-show-entries');
    }
    let localManageColumns = localStorage.getItem('search-form-manage-columns');
    if (localManageColumns !== undefined && localManageColumns !== null) {
      let localManageColumsObject = JSON.parse(localManageColumns);
      this.dataTableForm.controls['columnFilter'].setValue(localManageColumsObject);
      this.setColumsAfterRedirection(localManageColumsObject);
      localStorage.removeItem('search-form-manage-columns');
    }
    if (this.defaultRecords && this.defaultRecords !== undefined) {
      showEntriesList.map((obj:any) => {
        if (obj.name === this.defaultRecords) {
          this.showEntries.defaultValue = obj;
          this.itemsPerPage = obj.id;
          this.currentPage = 1;
          this.setRecordData(1);
        } else {
          this.showEntries.defaultValue = showEntriesList[2];
        }
      });
    }
  }


  setColumsAfterRedirection(columns: []) {
    this.setColumnFilter();
    if (columns.length === this.allColumns.length) {
      this.selectedColumns = concat(this.selectedColumns, this.allColumns);
    } else {
      forEach(columns, (value, key) => {
        this.selectedColumns.push(value);
      });
    }
  }

  iconButtonClick() {}

  // #region other functions


  dropRow(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.collection, event.previousIndex, event.currentIndex);
  }
  dropCol(event: CdkDragDrop<string[]>) {
    console.log(event);
    
    moveItemInArray(this.selectedColumns, event.previousIndex, event.currentIndex);
     console.log(this.selectedColumns, this.collection)
  }
  mouseDown(event,el:any=null){
    el=el || event.target
    this.pos={x:el.getBoundingClientRect().left-event.clientX+'px',
    y:el.getBoundingClientRect().top-event.clientY+'px',
    width:el.getBoundingClientRect().width+'px'
    }
  }
  onDragRelease(event: CdkDragRelease) {
    this.renderer2.setStyle(event.source.element.nativeElement,'margin-left','0px')
  }

  setColumnFilter(): void {
    this.selectedColumns = [];
    forEach(this.defaultColumns, (value, key: number) => this.selectedColumns.push(value));
  }

  setDefaultValues() {
    if (this.isSorting !== undefined && !this.isSorting) {
      this.itemsPerPage = this.collection.length;
    } else {
      this.itemsPerPage = 50;
    }
    this.currentPage = 1;
    this.nextLabel = this.nextLabel ? this.nextLabel : '';
    this.previousLabel = this.previousLabel ? this.previousLabel : '';
    this.total = this.collection.length;
    this.recordStartValue = 1;
    this.recordEndValue = this.itemsPerPage;
    if (this.total < this.itemsPerPage) {
      this.recordEndValue = this.total;
    }
  }

  pageChanged(event: number) {
    this.currentPage = event;
    this.setRecordData(event);
  }

  onSortingChanged(column: any) {
    if (!column.sortable) {
      return;
    }
    let sortDirection;
    if (column.sortDir === 'asc') {
      sortDirection = 'desc' as const;
    } else {
      sortDirection = 'asc' as const;
    }
    column.sortDir = sortDirection;

    this.collection = orderBy(this.collection, [column.id], [sortDirection]);
    // set datatable
    this.currentPage = 1;
    this.setRecordData(1);
  }

  setRecordData(page: number) {
    const previousPage = page - 1;
    const startValue = previousPage * this.itemsPerPage + 1;
    this.recordStartValue = startValue;
    const endValue = page * this.itemsPerPage;
    this.recordEndValue = endValue;
    if (endValue > this.total) {
      this.recordEndValue = this.total;
    }
  }

  showEntriesValueChange(data: any) {
    if (data.value) {
      this.itemsPerPage = data.value;
      this.currentPage = 1;
      this.setRecordData(1);
    }
  }

  onColumnFilterChanged(data: any) {
    switch (data.event) {
      case 'onItemSelect': {
        this.setColumnFilter();
        this.selectedColumns = data.value;
        break;
      }
      case 'onItemDeSelect': {
        this.setColumnFilter();
        this.selectedColumns = data.value;
        break;
      }
      case 'onSelectAll': {
        this.setColumnFilter();
        this.selectedColumns = this.allColumns;
        break;
      }
      default: {
        this.setColumnFilter();
        break;
      }
    }
  }

  backToSearch() {
    this.router.navigate([localStorage.getItem('search-form-url')]);
  }

  rowClicked(data: object) {
    if (data !== undefined && data !== null) {
      this.setSearchDataInLocalStorage();
      this.rowClick.emit({ event: 'rowClick', value: data });
    }
  }

  setSearchDataInLocalStorage() {
    localStorage.setItem('search-form-current-page', this.currentPage.toString());
    localStorage.setItem('search-form-show-entries', JSON.stringify(this.dataTableForm.controls['showEntries'].value));
    let columnFilterValue = [];
    if (
      this.dataTableForm.controls['columnFilter'].value !== null &&
      this.dataTableForm.controls['columnFilter'].value !== undefined
    ) {
      columnFilterValue = this.dataTableForm.controls['columnFilter'].value;
    }
    localStorage.setItem('search-form-manage-columns', JSON.stringify(columnFilterValue));
  }

  public exportCsv() {
    // export csv code goes here
    this.exportCSV.emit(this.selectedColumns);
  }
  // #endregion
}
