export type PortfolioAsset = {
  symbol: string;
  shortname: string;
  percentage: number;
};

export type Portfolio = {
  name: string;
  assets: PortfolioAsset[];
  color: string;
};

export type PortfolioPerformanceMetrics = {
  sharpe: number;
  risk: number;
  return: number;
  color?: string;
};
