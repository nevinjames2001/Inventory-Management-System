export interface InventoryItems{
  ItemID: number;
  name: string;
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  warehouseID: number;
  categoryID: number;
  minStockLevel: number;
  createdDate: string;
  modifiedDate: string;
}
