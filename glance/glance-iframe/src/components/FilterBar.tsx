import React, { useState, useRef, useEffect } from 'react';
import {
  Language,
  POPULAR_LANGUAGES,
  DATE_RANGES,
  DateRange,
} from '../constants/languages';
import './FilterBar.css';

interface FilterBarProps {
  selectedLanguage: string;
  selectedDateRange: DateRange;
  onLanguageChange: (language: string) => void;
  onDateRangeChange: (dateRange: DateRange) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedLanguage,
  selectedDateRange,
  onLanguageChange,
  onDateRangeChange,
}) => {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState('');
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  // Filter languages based on search
  const filteredLanguages = POPULAR_LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(languageSearch.toLowerCase()),
  );

  // Get the display name for selected language
  const selectedLanguageDisplay =
    POPULAR_LANGUAGES.find(lang => lang.value === selectedLanguage)?.name ||
    'Any Language';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language.value);
    setIsLanguageDropdownOpen(false);
    setLanguageSearch('');
  };

  const handleDateRangeSelect = (dateRange: DateRange) => {
    onDateRangeChange(dateRange);
  };

  return (
    <div className='filter-bar'>
      <div className='filter-bar-content'>
        <div className='filter-section'>
          <div className='filter-group'>
            <div className='language-filter' ref={languageDropdownRef}>
              <button
                className='filter-button language-button'
                onClick={() =>
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                }
                aria-haspopup='listbox'
                aria-expanded={isLanguageDropdownOpen}
              >
                <svg
                  className='filter-icon'
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                >
                  <path
                    fillRule='evenodd'
                    d='M1.5 2.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25v-.5zM1.75 2a1.75 1.75 0 00-1.75 1.75v.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0016 4.25v-.5A1.75 1.75 0 0014.25 2H1.75zM8 7a.75.75 0 01.75.75v3.5a.25.25 0 00.25.25h3.25a.75.75 0 010 1.5H9a1.75 1.75 0 01-1.75-1.75V7.75A.75.75 0 018 7z'
                  />
                </svg>
                <span className='filter-text'>Language: </span>
                <span className='filter-value'>{selectedLanguageDisplay}</span>
                <svg
                  className='dropdown-arrow'
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                >
                  <path
                    fillRule='evenodd'
                    d='M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z'
                  />
                </svg>
              </button>

              {isLanguageDropdownOpen && (
                <div className='language-dropdown'>
                  <div className='dropdown-search'>
                    <input
                      type='text'
                      placeholder='Filter languages'
                      value={languageSearch}
                      onChange={e => setLanguageSearch(e.target.value)}
                      className='search-input'
                      autoFocus
                    />
                  </div>
                  <div className='dropdown-list'>
                    {filteredLanguages.map(language => (
                      <button
                        key={language.value}
                        className={`dropdown-item ${
                          language.value === selectedLanguage ? 'selected' : ''
                        }`}
                        onClick={() => handleLanguageSelect(language)}
                      >
                        {language.name}
                        {language.value === selectedLanguage && (
                          <svg
                            className='check-icon'
                            width='16'
                            height='16'
                            viewBox='0 0 16 16'
                          >
                            <path
                              fillRule='evenodd'
                              d='M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 13.94l6.72-6.72a.75.75 0 011.06 0z'
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className='date-range-filter'>
              <div className='date-range-buttons'>
                {DATE_RANGES.map(range => (
                  <button
                    key={range.value}
                    className={`date-range-button ${
                      range.value === selectedDateRange ? 'selected' : ''
                    }`}
                    onClick={() => handleDateRangeSelect(range.value)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
