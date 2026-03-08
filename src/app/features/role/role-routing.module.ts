import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleListComponent } from './components/role-list/role-list.component';
import { RoleFormComponent } from './components/role-form/role-form.component';

const routes: Routes = [
  {
    path: '',
    component: RoleListComponent
  },
  {
    path: 'add',
    component: RoleFormComponent
  },
  {
    path: 'edit/:id',
    component: RoleFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule {}