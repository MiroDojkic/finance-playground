export type PortfolioAsset = {
  symbol: string;
  shortname: string;
  percentage: number;
};

export type Portfolio = {
  name: string;
  assets: PortfolioAsset[];
};

export type PortfolioPerformanceMetrics = {
  sharpe: number;
  risk: number;
  return: number;
};
