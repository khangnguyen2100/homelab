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

export interface ApiKeyResponse {
  results: string;
}

const API_BASE_URL = 'https://api.vnappmob.com/api/v2/gold';
const API_KEY_REQUEST_URL = 'https://api.vnappmob.com/api/request_api_key?scope=gold';

/**
 * Fetch a new API key from the VNAppMob API
 */
const getApiKey = async (): Promise<string> => {
  try {
    const response = await axios.get<ApiKeyResponse>(API_KEY_REQUEST_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // API returns token in the 'results' field
    if (response.data && response.data.results) {
      return response.data.results;
    } else {
      throw new Error('Invalid API key response format');
    }
  } catch (error) {
    console.error('Failed to fetch API key:', error);
    throw new Error('Unable to fetch API key');
  }
};

/**
 * Make an authenticated request to the gold price API
 */
const makeGoldApiRequest = async (
  endpoint: string,
  params: Record<string, string | number> = {},
): Promise<GoldApiResponse> => {
  try {
    // Fetch a new API key for each request
    const apiKey = await getApiKey();
    
    const response = await axios.get<GoldApiResponse>(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Gold API error:', error);
    throw error;
  }
};

/**
 * Get current SJC gold prices
 */
export const getCurrentSJCPrices = async (): Promise<GoldApiResponse> => {
  return makeGoldApiRequest('/sjc');
};

/**
 * Get SJC gold prices with date range (unix timestamps)
 */
export const getSJCPricesInRange = async (
  dateFrom: number,
  dateTo: number,
): Promise<GoldApiResponse> => {
  return makeGoldApiRequest('/sjc', {
    date_from: dateFrom,
    date_to: dateTo,
  });
};

/**
 * Get past 30 days SJC prices
 */
export const getPast30DaysSJCPrices = async (): Promise<GoldApiResponse> => {
  const now = new Date();
  const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const dateFrom = Math.floor(past30Days.getTime() / 1000);
  const dateTo = Math.floor(now.getTime() / 1000);

  return getSJCPricesInRange(dateFrom, dateTo);
};

/**
 * Helper function to format price for display
 */
export const formatPrice = (price: string): string => {
  const numPrice = parseFloat(price.replace(/,/g, ''));
  return numPrice.toLocaleString('vi-VN') + ' VNĐ';
};

// Default export object for backward compatibility
const goldService = {
  getCurrentSJCPrices,
  getSJCPricesInRange,
  getPast30DaysSJCPrices,
  formatPrice,
};

export default goldService;
