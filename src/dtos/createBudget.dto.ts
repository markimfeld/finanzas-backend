
export interface CreateBudgetDto {
    _id: string,
    usedId: string,
    category: string,
    amount: number,
    startDate: Date,
    endDate: Date,
}
