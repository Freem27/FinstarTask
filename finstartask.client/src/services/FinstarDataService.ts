import { FinstarRow, NewFinstarRow, SetNewDataRequest } from "../types/FinstarDataTypes"
import { PagedResult } from "../types/PagedResult";
import { Fetch } from "../utils/FetchUtil"

export const FinstarDataServie = {
  GetForecast: async (): Promise<Forecast[] | undefined> => {
    return await Fetch<Forecast[]>('weatherforecast', 'GET');
  },
  Get: async (page: number, pageSize: number): Promise<PagedResult<FinstarRow> | undefined> => {
    return await Fetch<PagedResult<FinstarRow>>('api/data/Get', 'GET', {page, pageSize});
  },
  TruncateAndInsert: async (items: NewFinstarRow[], pageSize: number): Promise<PagedResult<FinstarRow> | undefined> => {
    const data: SetNewDataRequest = {
      items,
      pageSize,
    }
    return await Fetch<PagedResult<FinstarRow>>('api/data/TruncateAndInsert', 'POST', data);
  }
}
interface Forecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
