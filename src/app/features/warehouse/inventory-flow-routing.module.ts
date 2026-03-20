import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components (tạo sau)
import { PurchaseOrderListComponent } from './components/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderCreateComponent } from './components/purchase-order-create/purchase-order-create.component';
import { StockMovementListComponent } from './components/stock-movement-list/stock-movement-list.component';

const routes: Routes = [
  {
    path: 'purchase-orders',
    children: [
      {
        path: '',
        component: PurchaseOrderListComponent
      },
      {
        path: 'create',
        component: PurchaseOrderCreateComponent
      },
      {
        path: ':id',
        component: PurchaseOrderCreateComponent
      }
    ]
  },
  {
    path: 'stock-movements',
    component: StockMovementListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryFlowRoutingModule {}