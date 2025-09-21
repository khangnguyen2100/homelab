import axios from 'axios';

export interface GoldPrice {
  buy_1c: string;
  buy_1l: string;
  buy_5c: string;
  buy_nhan1c: string;
  buy_nutrang_75: string;
  buy_nutrang_99: string;
  buy_nutrang_9999: string;
  datetime: string;
  sell_1c: string;
  sell_1l: string;
  sell_5c: string;
  sell_nhan1c: string;
  sell_nutrang_75: string;
  sell_nutrang_99: string;
  sell_nutrang_9999: string;
}

export interface GoldApiResponse {
  results: GoldPrice[];
}

const API_BASE_URL = 'https://api.vnappmob.com/api/v2/gold';
const API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTk2ODExNTEsImlhdCI6MTc1ODM4NTE1MSwic2NvcGUiOiJnb2xkIiwicGVybWlzc2lvbiI6MH0.GP81nzRycG4cHBVYqcYB1LcGwHiz8RCGvd88wnybNdY';

class GoldService {
  private async makeRequest(
    endpoint: string,
    params: Record<string, string | number> = {},
  ) {
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Gold API error:', error);
      throw error;
    }
  }

  // Get current SJC gold prices
  async getCurrentSJCPrices(): Promise<GoldApiResponse> {
    return this.makeRequest('/sjc');
  }

  // Get SJC gold prices with date range (unix timestamps)
  async getSJCPricesInRange(
    dateFrom: number,
    dateTo: number,
  ): Promise<GoldApiResponse> {
    return this.makeRequest('/sjc', {
      date_from: dateFrom,
      date_to: dateTo,
    });
  }

  // Get past 30 days SJC prices
  async getPast30DaysSJCPrices(): Promise<GoldApiResponse> {
    const now = new Date();
    const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dateFrom = Math.floor(past30Days.getTime() / 1000);
    const dateTo = Math.floor(now.getTime() / 1000);

    return this.getSJCPricesInRange(dateFrom, dateTo);
  }

  // Helper function to format price for display
  formatPrice(price: string): string {
    const numPrice = parseFloat(price.replace(/,/g, ''));
    return numPrice.toLocaleString('vi-VN') + ' VNĐ';
  }
}

export const goldService = new GoldService();
