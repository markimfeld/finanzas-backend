import { Schema } from "mongoose";

export interface UpdateBudgetDto {
  amount?: number;
  userId?: Schema.Types.ObjectId;
  category?: Schema.Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
}
