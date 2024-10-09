import random from 'lodash/random';
import { getCovarianceMatrix, getMeanReturns } from "@/api";

const numberOfTradingDays = 252;

type Asset = string;

type Portfolio = {
  assets: Asset[];
  weights: number[];
  portfolioReturn: number;
  portfolioRisk: number;
  risk: number;
  return: number;
  sharpe: number;
};

export async function getPortfolioAnalysis(
  assets: Asset[],
  weights: number[],
  startDate: string
) {
  if (assets.length !== weights.length) {
    throw new Error('Number of assets and weights must be the same.');
  }
  const [covMatrix, meanReturns] = await Promise.all([
    getCovarianceMatrix(assets, startDate),
    getMeanReturns(assets, startDate)
  ]);
  const portfolioReturn = weights
    .map((w, idx) => w * meanReturns[idx])
    .reduce((acc, curr) => acc + curr, 0);
  const annualizedReturn = Math.pow(portfolioReturn + 1, numberOfTradingDays) - 1;

  let portfolioVariance = 0;
  weights.forEach((wj, j) => {
    weights.forEach((wk, k) => {
      portfolioVariance += wj * wk * covMatrix[j][k];
    });
  });
  const portfolioRisk = Math.sqrt(portfolioVariance);
  const annualizedRisk = Math.sqrt(numberOfTradingDays) * portfolioRisk;

  const sharpe = annualizedReturn / annualizedRisk;

  return {
    assets,
    weights,
    sharpe,
    portfolioReturn,
    portfolioRisk,
    risk: annualizedRisk,
    return: annualizedReturn
  };
}

export async function getSimulatedPortfolios(
  assets: Asset[],
  startDate: string,
  numberOfPortfolios: number
): Promise<Portfolio[]> {
  const [covMatrix, meanReturns] = await Promise.all([
    getCovarianceMatrix(assets, startDate),
    getMeanReturns(assets, startDate)
  ]);

  return Array.from({ length: numberOfPortfolios }).map(() => {
    const weights = getRandomWeights(assets.length);
    const portfolioReturn = weights
      .map((w, idx) => w * meanReturns[idx])
      .reduce((acc, curr) => acc + curr, 0);
    const annualizedReturn = Math.pow(portfolioReturn + 1, numberOfTradingDays) - 1;

    let portfolioVariance = 0;
    weights.forEach((wj, j) => {
      weights.forEach((wk, k) => {
        portfolioVariance += wj * wk * covMatrix[j][k];
      });
    });
    const portfolioRisk = Math.sqrt(portfolioVariance);
    const annualizedRisk = Math.sqrt(numberOfTradingDays) * portfolioRisk;

    const sharpe = annualizedReturn / annualizedRisk;

    return {
      assets,
      weights,
      sharpe,
      portfolioReturn,
      portfolioRisk,
      risk: annualizedRisk,
      return: annualizedReturn
    };
  });
}

function getRandomWeights(size: number): number[] {
  let weights = Array(size).fill(0).map(() => random(size));
  const sumWeights = weights.reduce((a, b) => a + b, 0);
  weights = weights.map(w => w / sumWeights);
  return weights;
}
