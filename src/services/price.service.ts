import { IPriceRepository } from "../interfaces/repositories/price.repository.interface";

export class PriceService {
  private priceRepository: IPriceRepository;

  constructor(priceRepository: IPriceRepository) {
    this.priceRepository = priceRepository;
  }

  async getSymbolPrice(symbol: string): Promise<number> {
    const price = await this.priceRepository.getPriceBySymbol(symbol);
    return Number(price.toFixed(2)); // redondeo a 2 decimales
  }
}
