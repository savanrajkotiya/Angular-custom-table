/** Core Modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
const APP_COREMODULES = [HttpClientModule, DragDropModule];

/** External Modules */

/** Components */
import { DataTableComponent } from './data-table/data-table.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

const APP_COMPONENTS = [DataTableComponent];

@NgModule({
  declarations: [...APP_COMPONENTS],
  imports: [CommonModule, RouterModule, ...APP_COREMODULES],
  exports: [...APP_COMPONENTS, ...APP_COREMODULES],
  providers: [],
})
export class SharedComponentModule {}
