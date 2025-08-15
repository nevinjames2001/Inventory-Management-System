export interface stockAdjustmentLogs{
  logID: number;
  itemID: number;
  oldQuantity: number;
  newQuantity: string;
  reason: string;
  adjustedBy: string;
  adjustedDate: string;
}
