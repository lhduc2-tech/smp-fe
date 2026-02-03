import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './components/cate-list/cate-list.component';
import { CategoryFormComponent } from './components/cate-form/cate-form.component';

const routes: Routes = [
  { path: '', component: CategoryListComponent },
  { path: 'add', component: CategoryFormComponent },
  { path: ':id', component: CategoryFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule {}
