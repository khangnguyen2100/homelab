export interface Contributor {
  avatar: string;
  name: string;
  url: string;
}

export interface Repository {
  title: string;
  url: string;
  description: string;
  language: string;
  languageColor: string;
  stars: string;
  forks: string;
  addStars: string;
  contributors: Contributor[];
}

export interface TrendingResponse {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  items: Repository[];
}
