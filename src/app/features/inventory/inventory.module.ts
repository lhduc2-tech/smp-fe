import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryRoutingModule } from './inventory-routing.module';
import { FormsModule } from '@angular/forms';

import { InventoryListComponent } from './components/inventory-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InventoryRoutingModule,
    InventoryListComponent
  ]
})
export class InventoryModule {}