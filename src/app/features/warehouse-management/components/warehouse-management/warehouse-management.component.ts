import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';

@Component({
  selector: 'app-warehouse-management',
  standalone: true,
  imports: [CommonModule, ...SHARED_UI_IMPORTS],
  templateUrl: './warehouse-management.component.html',
  styleUrls: ['./warehouse-management.component.css']
})
export class WarehouseManagementComponent {
}
