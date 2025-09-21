import React, { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import RepositoryCard from '../components/RepositoryCard';
import FilterBar from '../components/FilterBar';
import { Repository } from '../types/repository';
import { DateRange } from '../constants/languages';
import { GitHubTrendingService } from '../services/githubTrendingService';
import './TrendingPage.css';

const TrendingPage: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] =
    useState<DateRange>('daily');

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { repositories: initialRepos, hasMore: initialHasMore } =
        await GitHubTrendingService.fetchPaginatedRepositories(
          1,
          selectedLanguage,
          selectedDateRange,
        );

      setRepositories(initialRepos);
      setHasMore(initialHasMore);
      setCurrentPage(1);
    } catch (err) {
      setError('Failed to load trending repositories. Please try again later.');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedLanguage, selectedDateRange]);

  const loadMoreRepositories = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);

      const nextPage = currentPage + 1;
      const { repositories: newRepos, hasMore: moreAvailable } =
        await GitHubTrendingService.fetchPaginatedRepositories(
          nextPage,
          selectedLanguage,
          selectedDateRange,
        );

      setRepositories(prev => [...prev, ...newRepos]);
      setHasMore(moreAvailable);
      setCurrentPage(nextPage);
    } catch (err) {
      setError('Failed to load more repositories.');
      console.error('Error loading more repositories:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, loading, selectedLanguage, selectedDateRange]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handle language filter change
  const handleLanguageChange = useCallback((language: string) => {
    setSelectedLanguage(language);
    setRepositories([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  // Handle date range filter change
  const handleDateRangeChange = useCallback((dateRange: DateRange) => {
    setSelectedDateRange(dateRange);
    setRepositories([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  if (loading && repositories.length === 0) {
    return (
      <div className='trending-page'>
        <div className='loading-container'>
          <div className='loading-spinner'>
            <div className='spinner'></div>
          </div>
          <p>Loading trending repositories...</p>
        </div>
      </div>
    );
  }

  if (error && repositories.length === 0) {
    return (
      <div className='trending-page'>
        <div className='error-container'>
          <div className='error-message'>
            <svg
              className='error-icon'
              width='24'
              height='24'
              viewBox='0 0 24 24'
            >
              <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
            </svg>
            <p>{error}</p>
            <button onClick={loadInitialData} className='retry-button'>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='trending-page'>
      <FilterBar
        selectedLanguage={selectedLanguage}
        selectedDateRange={selectedDateRange}
        onLanguageChange={handleLanguageChange}
        onDateRangeChange={handleDateRangeChange}
      />

      <div className='trending-content'>
        <InfiniteScroll
          dataLength={repositories.length}
          next={loadMoreRepositories}
          hasMore={hasMore}
          loader={
            <div className='loading-more'>
              <div className='spinner small'></div>
              <span>Loading more repositories...</span>
            </div>
          }
          endMessage={
            <div className='end-message'>
              <p>You've reached the end of the trending repositories!</p>
            </div>
          }
          refreshFunction={loadInitialData}
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>↓ Pull down to refresh</h3>
          }
          releaseToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>↑ Release to refresh</h3>
          }
        >
          <div className='repositories-list'>
            {repositories.map((repository, index) => (
              <RepositoryCard
                key={`${repository.title}-${index}`}
                repository={repository}
              />
            ))}
          </div>
        </InfiniteScroll>

        {error && repositories.length > 0 && (
          <div className='error-banner'>
            <p>{error}</p>
            <button
              onClick={loadMoreRepositories}
              className='retry-button small'
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingPage;
