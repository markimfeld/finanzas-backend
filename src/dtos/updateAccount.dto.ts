import { Schema } from "mongoose";

export interface UpdateAccountDto {
  name?: string;
  type?: string;
  balance?: number;
}
