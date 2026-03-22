import { ProductResponse } from '../../product/models/product.model';
export interface AdminDashboard {
  revenue: RevenueSummary;
  topProducts: TopProduct[];
  inventory: InventorySummary;
}
export interface RevenueSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;

  todayGrowth: number;     // % so với hôm qua
  weekGrowth: number;
  monthGrowth: number;
}
export interface TopProduct {
  productId: string;
  productName: string;
  sold: number;
  revenue: number;
}
export interface InventorySummary {
  totalStock: number;
  lowStockProducts: ProductResponse[];
  bestSellingProducts: TopProduct[];
  slowSellingProducts: TopProduct[];
}
export interface StaffDashboard {
  orderSummary: StaffOrderSummary;
  lowStockProducts: ProductResponse[];
}
export interface StaffOrderSummary {
  totalOrdersToday: number;

  pending: number;
  confirmed: number;
  cancelled: number;

  averageOrderValue: number;
}
export const MOCK_ADMIN_DASHBOARD: AdminDashboard = {
  revenue: {
    today: 1200000,
    thisWeek: 8500000,
    thisMonth: 32000000,

    todayGrowth: 12.5,
    weekGrowth: 8.2,
    monthGrowth: 15.7
  },

  topProducts: [
    { productId: '1', productName: 'Áo thun', sold: 120, revenue: 6000000 },
    { productId: '2', productName: 'Quần jean', sold: 80, revenue: 8000000 }
  ],

  inventory: {
    totalStock: 500,

    lowStockProducts: [
      { id: '1', code: 'SP01', name: 'Áo sơ mi', price: 200000 },
      { id: '2', code: 'SP02', name: 'Quần short', price: 150000 }
    ],

    bestSellingProducts: [
      { productId: '1', productName: 'Áo thun', sold: 120, revenue: 6000000 }
    ],

    slowSellingProducts: [
      { productId: '3', productName: 'Áo khoác', sold: 5, revenue: 2000000 }
    ]
  }
};
export const MOCK_STAFF_DASHBOARD: StaffDashboard = {
  orderSummary: {
    totalOrdersToday: 25,
    pending: 5,
    confirmed: 18,
    cancelled: 2,
    averageOrderValue: 250000
  },

  lowStockProducts: [
    { id: '1', code: 'SP01', name: 'Áo sơ mi', price: 200000 },
    { id: '2', code: 'SP02', name: 'Quần short', price: 150000 }
  ]
};