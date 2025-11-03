import yahooClient from "../../../utils/yahooClient";
import { IPriceRepository } from "../../../interfaces/repositories/price.repository.interface";

export class PriceRepository implements IPriceRepository {
  async getPriceBySymbol(symbol: string): Promise<number> {
    try {
      const { data } = await yahooClient.get(`/${symbol}`, {
        params: { interval: "1d", range: "1d" },
      });

      const result = data.chart?.result?.[0];
      if (!result) throw new Error("No se encontró información del símbolo");

      const close = result.indicators.quote[0].close[0];
      if (!close) throw new Error("Precio no disponible");

      return close;
    } catch (error: any) {
      throw new Error(`Error al obtener precio de ${symbol}: ${error.message}`);
    }
  }
}
