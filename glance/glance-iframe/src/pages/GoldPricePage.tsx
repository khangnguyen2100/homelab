import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getCurrentSJCPrices, getPast30DaysSJCPrices, GoldPrice } from '../services/goldService';
import './GoldPricePage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const GoldPricePage: React.FC = () => {
  const [goldData, setGoldData] = useState<GoldPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<GoldPrice | null>(null);

  useEffect(() => {
    const fetchGoldData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch past 30 days data and current price
        const [monthlyResponse, currentResponse] = await Promise.all([
          getPast30DaysSJCPrices(),
          getCurrentSJCPrices(),
        ]);

        if (monthlyResponse.results && monthlyResponse.results.length > 0) {
          // Sort data by datetime to ensure proper chronological order
          const sortedData = monthlyResponse.results.sort((a: GoldPrice, b: GoldPrice) => 
            parseInt(a.datetime) - parseInt(b.datetime)
          );
          setGoldData(sortedData);
        }

        if (currentResponse.results && currentResponse.results.length > 0) {
          setCurrentPrice(currentResponse.results[0]);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu giá vàng');
        console.error('Error fetching gold data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoldData();
  }, []);

  // Prepare chart data
  const chartData = {
    labels: goldData.map(item => {
      if (item.datetime) {
        // datetime is already unix timestamp, convert to Date
        const date = new Date(parseInt(item.datetime) * 1000);
        return date.toLocaleDateString('vi-VN', {
          month: '2-digit',
          day: '2-digit',
        });
      }
      return '';
    }),
    datasets: [
      {
        label: 'Giá mua',
        data: goldData.map(
          item => parseFloat(item.buy_1l.replace(/,/g, '')) / 1000000,
        ), // Convert to millions
        borderColor: '#22c55e', // Green for buy price
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.3,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#b5b5c0',
        pointBorderWidth: 2,
      },
      {
        label: 'Giá bán',
        data: goldData.map(
          item => parseFloat(item.sell_1l.replace(/,/g, '')) / 1000000,
        ), // Convert to millions
        borderColor: '#f59e0b', // Amber for sell price
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.3,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#b5b5c0',
        pointBorderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#b5b5c0',
          font: {
            size: 12,
            family: "'JetBrains Mono', monospace",
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: false, // Remove title since we have header
      },
      tooltip: {
        backgroundColor: 'var(--color-widget-background)',
        titleColor: '#b5b5c0',
        bodyColor: '#b5b5c0',
        borderColor: 'var(--color-widget-content-border)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: function (context) {
            // Show full date in tooltip title
            const dataIndex = context[0].dataIndex;
            const datetime = goldData[dataIndex]?.datetime;
            if (datetime) {
              const date = new Date(parseInt(datetime) * 1000);
              return date.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
            }
            return '';
          },
          label: function (context) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${value.toFixed(2)}M VNĐ/lượng`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'var(--color-separator)',
        },
        ticks: {
          color: '#b5b5c0',
          font: {
            size: 11,
            family: "'JetBrains Mono', monospace",
          },
          maxRotation: 45,
        },
      },
      y: {
        display: true,
        position: 'left' as const,
        grid: {
          color: 'var(--color-separator)',
        },
        ticks: {
          color: '#b5b5c0',
          font: {
            size: 11,
            family: "'JetBrains Mono', monospace",
          },
          callback: function (value) {
            return value + 'M';
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className='gold-price-page'>
        <div className='loading'>
          <div className='spinner'></div>
          <p>Đang tải dữ liệu giá vàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='gold-price-page'>
        <div className='error'>
          <p>{error}</p>
          <button
            className='retry-btn'
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Calculate price change
  const priceChange =
    goldData.length >= 2
      ? parseFloat(goldData[goldData.length - 1].buy_1l.replace(/,/g, '')) -
        parseFloat(goldData[goldData.length - 2].buy_1l.replace(/,/g, ''))
      : 0;
  const percentageChange =
    goldData.length >= 2
      ? (priceChange /
          parseFloat(goldData[goldData.length - 2].buy_1l.replace(/,/g, ''))) *
        100
      : 0;

  // Helper function to format price in millions
  const formatPriceInMillions = (price: string): string => {
    const numPrice = parseFloat(price.replace(/,/g, ''));
    const millions = numPrice / 1000000;
    // Only show decimal if it's not a whole number
    return (millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)) + ' triệu';
  };

  // Helper function to format price change
  const formatPriceChange = (change: number): string => {
    return (change / 1000).toFixed(0) + 'k';
  };

  // Calculate price change from yesterday to today
  const getTodayPriceChange = () => {
    if (goldData.length < 2) return { change: 0, percentage: 0 };
    
    const today = goldData[goldData.length - 1];
    const yesterday = goldData[goldData.length - 2];
    
    const todayBuyPrice = parseFloat(today.buy_1l.replace(/,/g, ''));
    const yesterdayBuyPrice = parseFloat(yesterday.buy_1l.replace(/,/g, ''));
    
    const change = todayBuyPrice - yesterdayBuyPrice;
    const percentage = (change / yesterdayBuyPrice) * 100;
    
    return { change, percentage };
  };

  const todayChange = getTodayPriceChange();

  return (
    <div className='gold-price-page'>
      
      {/* Daily price change status */}
      {currentPrice && (
        <div className={`daily-status ${todayChange.change >= 0 ? 'positive' : 'negative'}`}>
          <div className="status-content">
            <span className="status-text">
              {todayChange.change >= 0 ? 'Tăng' : 'Giảm'}: {formatPriceInMillions(Math.abs(todayChange.change).toString())}
            </span>
          </div>
        </div>
      )}

      {currentPrice && (
        <div className='current-prices'>
          <div className='price-card buy-price'>
            <h3>Giá mua</h3>
            <div className='price'>
              {formatPriceInMillions(currentPrice.buy_1l)}
            </div>
            <div className='price-detailed'>VNĐ/lượng</div>
          </div>
          <div className='price-card sell-price'>
            <h3>Giá bán</h3>
            <div className='price'>
              {formatPriceInMillions(currentPrice.sell_1l)}
            </div>
            <div className='price-detailed'>VNĐ/lượng</div>
          </div>
        </div>
      )}

      <div className='chart-container'>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default GoldPricePage;
