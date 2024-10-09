import type { Portfolio } from "@/models";

const portfolioTableKey = '$portfolio$__';

function listPortfolios(): Portfolio['name'][] {
  const keys = Object.keys(localStorage);
  return keys
    .filter(key => key.startsWith(portfolioTableKey))
    .map(key => key.replace(portfolioTableKey, ''));
}

function getPortfolio(key: Portfolio['name']): Portfolio {
  const item = localStorage.getItem(`${portfolioTableKey}${key}`);
  return item ? JSON.parse(item) : null;
}

function savePortfolio(key: Portfolio['name'], value: Portfolio): void {
  localStorage.setItem(`${portfolioTableKey}${key}`, JSON.stringify(value));
}

export default { listPortfolios, getPortfolio, savePortfolio };
