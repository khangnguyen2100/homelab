import axios from 'axios';
import { TrendingResponse, Repository } from '../types/repository';
import { DateRange } from '../constants/languages';

const API_BASE_URL =
  'https://raw.githubusercontent.com/isboyjc/github-trending-api/main/data';

export class GitHubTrendingService {
  private static readonly ITEMS_PER_PAGE = 10;

  /**
   * Fetch trending repositories for specified language and date range
   */
  static async fetchTrendingRepositories(
    language: string = 'all',
    dateRange: DateRange = 'weekly',
  ): Promise<Repository[]> {
    try {
      const url = `${API_BASE_URL}/${dateRange}/${language}.json`;
      const response = await axios.get<TrendingResponse>(url);
      return response.data.items;
    } catch (error) {
      console.error('Error fetching trending repositories:', error);
      throw new Error('Failed to fetch trending repositories');
    }
  }

  /**
   * Simulate pagination by slicing the data
   * Since the API doesn't support pagination, we'll load all data and paginate client-side
   */
  static async fetchPaginatedRepositories(
    page: number = 1,
    language: string = 'all',
    dateRange: DateRange = 'weekly',
  ): Promise<{
    repositories: Repository[];
    hasMore: boolean;
    currentPage: number;
  }> {
    try {
      const allRepositories = await this.fetchTrendingRepositories(
        language,
        dateRange,
      );
      const startIndex = (page - 1) * this.ITEMS_PER_PAGE;
      const endIndex = startIndex + this.ITEMS_PER_PAGE;

      const repositories = allRepositories.slice(startIndex, endIndex);
      const hasMore = endIndex < allRepositories.length;

      return {
        repositories,
        hasMore,
        currentPage: page,
      };
    } catch (error) {
      console.error('Error fetching paginated repositories:', error);
      throw error;
    }
  }

  /**
   * Get total number of repositories available for specified filters
   */
  static async getTotalRepositoriesCount(
    language: string = 'all',
    dateRange: DateRange = 'weekly',
  ): Promise<number> {
    try {
      const allRepositories = await this.fetchTrendingRepositories(
        language,
        dateRange,
      );
      return allRepositories.length;
    } catch (error) {
      console.error('Error getting total repositories count:', error);
      return 0;
    }
  }
}
