import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components (tạo sau)
import { PurchaseOrderListComponent } from './components/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderDetailComponent } from './components/purchase-order-detail/purchase-order-detail.component';
import { StockMovementListComponent } from './components/stock-movement-list/stock-movement-list.component';

const routes: Routes = [
  {
    path: 'purchase-orders',
    component: PurchaseOrderListComponent
  },
  {
    path: 'purchase-orders/:id',
    component: PurchaseOrderDetailComponent
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