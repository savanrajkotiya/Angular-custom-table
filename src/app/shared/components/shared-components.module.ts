/** Core Modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import {MatInputModule} from '@angular/material/input';
import { UsersService } from '@shared/services/users.service';
import { FilterPipe } from '@shared/pipes/filter.pipe';
const APP_COREMODULES = [HttpClientModule, DragDropModule, EffectsModule,FormsModule,MatInputModule];

/** External Modules */

/** Components */
import { DataTableComponent } from './data-table/data-table.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

const APP_COMPONENTS = [DataTableComponent];

@NgModule({
  declarations: [...APP_COMPONENTS, FilterPipe],
  imports: [CommonModule, RouterModule, ...APP_COREMODULES],
  exports: [...APP_COMPONENTS, ...APP_COREMODULES, FilterPipe],
  providers: [UsersService, FilterPipe],
})
export class SharedComponentModule {}
