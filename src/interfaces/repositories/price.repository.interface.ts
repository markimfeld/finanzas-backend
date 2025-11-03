export interface IPriceRepository {
  getPriceBySymbol(symbol: string): Promise<number>;
}
