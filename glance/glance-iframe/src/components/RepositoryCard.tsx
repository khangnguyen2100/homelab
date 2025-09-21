import React from 'react';
import { Repository } from '../types/repository';
import './RepositoryCard.css';

interface RepositoryCardProps {
  repository: Repository;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository }) => {
  return (
    <div className='repository-card'>
      <div className='repository-header'>
        <h3 className='repository-name'>
          <a href={repository.url} target='_blank' rel='noopener noreferrer'>
            {repository.title}
          </a>
        </h3>
        {repository.language && (
          <div className='language'>
            <span
              className='language-color'
              style={{ backgroundColor: repository.languageColor }}
            ></span>
            <span className='language-name'>{repository.language}</span>
          </div>
        )}
      </div>

      <div className='repository-description'>
        {repository.description && <p>{repository.description}</p>}
      </div>

      <div className='repository-stats'>
        <div className='repository-meta'>
          <div className='stats-item'>
            <svg
              aria-label='stars'
              className='icon'
              height='16'
              width='16'
              viewBox='0 0 16 16'
            >
              <path d='M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z'></path>
            </svg>
            <span className='stats-number'>{repository.stars}</span>
          </div>

          <div className='stats-item'>
            <svg
              aria-label='forks'
              className='icon'
              height='16'
              width='16'
              viewBox='0 0 16 16'
            >
              <path d='M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z'></path>
            </svg>
            <span className='stats-number'>{repository.forks}</span>
          </div>

          <div className='contributors'>
            <span className='contributors-label'>Built by:</span>
            <div className='contributors-list'>
              {repository.contributors.slice(0, 3).map((contributor, index) => (
                <a
                  key={index}
                  href={contributor.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='contributor-avatar'
                  title={contributor.name}
                >
                  <img src={contributor.avatar} alt={contributor.name} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className='weekly-growth'>
          <svg
            aria-label='star'
            className='icon growth-icon'
            height='16'
            width='16'
            viewBox='0 0 16 16'
          >
            <path d='M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z'></path>
          </svg>
          <span className='growth-number'>
            {repository.addStars} stars this week
          </span>
        </div>
      </div>
    </div>
  );
};

export default RepositoryCard;
