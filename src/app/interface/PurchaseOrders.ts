export interface PurchaseOrders{
  poId: number;
  supplierID: number;
  orderDate: string;
  expectedDelivery: string;
  status: string;
  totalAmount: number;
  createdDate: string;
}
