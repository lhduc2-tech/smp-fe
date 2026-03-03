import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SupplierListComponent } from './components/supplier-list/supplier-list.component';
import { SupplierFormComponent } from './components/supplier-form/supplier-form.component';

const routes: Routes = [
  { path: '', component: SupplierListComponent },
  { path: 'add', component: SupplierFormComponent },
  { path: ':id', component: SupplierFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule {}