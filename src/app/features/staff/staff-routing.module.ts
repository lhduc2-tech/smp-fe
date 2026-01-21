import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffListComponent } from './component/staff-list/staff-list.component';
import { StaffFormComponent } from './component/staff-form/staff-form.component';

const routes: Routes = [
  {
    path: '',
    component: StaffListComponent
  },
  {
    path: 'add',
    component: StaffFormComponent
  },
  {
    path: ':id',
    component: StaffFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
