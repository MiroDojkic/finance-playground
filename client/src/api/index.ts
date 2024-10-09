import type { PortfolioAsset } from '@/models';

export function searchAssets(search: string): Promise<PortfolioAsset[]> {
  return fetch(`http://localhost:3000/assets?search=${search}`)
    .then(response => response.json())
    .then(data => data.data);
}

export function getMeanReturns(assets: string[], startDate: string) {
  const query = assets.map(asset => `assets=${asset}`).join('&');

  return fetch(`http://localhost:3000/mean-returns?startDate=${startDate}&${query}`)
    .then(response => response.json())
    .then(data => data.data);
}

export function getCovarianceMatrix(assets: string[], startDate: string) {
  const query = assets.map(asset => `assets=${asset}`).join('&');

  return fetch(`http://localhost:3000/covariance-matrix?startDate=${startDate}&${query}`)
    .then(response => response.json())
    .then(data => data.data);
}
