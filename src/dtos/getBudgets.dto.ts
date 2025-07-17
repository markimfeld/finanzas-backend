export interface GetBudgetsDto {
  page: number;
  limit: number;
  category?: string;
  startDate?: Date;
  endDate?: Date;
}
