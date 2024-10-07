import yahooFinance from 'yahoo-finance2';
import * as statistics from 'simple-statistics';

const cache = {};

export async function search(term) {
  const result = await yahooFinance.search(term);
  return result.quotes.map(toSearchDTO);
}

export async function fetchMeanReturns(assets, startDate) {
  const cacheNamespace = 'meanReturns';
  const query = { assets, startDate };
  const cached = getCache(query, cacheNamespace);
  if (cached) return cached;

  const historicals = await fetchHistoricals(assets, startDate);
  const dailyReturnsMatrix = getReturnsMatrix(historicals);
  const meanReturns = dailyReturnsMatrix.map(returns => statistics.mean(returns));
  setCache(query, meanReturns, cacheNamespace);
  return meanReturns;
}

export async function fetchCovarianceMatrix(assets, startDate) {
  const cacheNamespace = 'covarianceMatrix';
  const query = { assets, startDate };
  const cached = getCache(query, cacheNamespace);
  if (cached) return cached;

  const historicals = await fetchHistoricals(assets, startDate);
  const dailyReturnsMatrix = getReturnsMatrix(historicals);
  const covarianceMatrix = getCovarianceMatrix(dailyReturnsMatrix);
  setCache(query, covarianceMatrix, cacheNamespace);
  return covarianceMatrix;
}

function fetchHistoricals(assets, startDate) {
  return Promise.all(
    assets.map(asset => yahooFinance.historical(asset, { period1: startDate }))
  );
}

function getCovarianceMatrix(returnsMatrix) {
  return returnsMatrix.map(fst => {
    return returnsMatrix.map(snd => statistics.sampleCovariance(fst, snd));
  });
}

function getReturnsMatrix(historicals) {
  return forwardFill(historicals).map(assetHistoricals => {
    const prices = assetHistoricals.map(it => it.adjClose);
    return prices.reduce((returns, price, idx) => {
      const isFirst = idx === 0;
      if (isFirst) return returns;

      const prevPrice = prices[idx - 1];
      return [...returns, getReturns(price, prevPrice)];
    }, []);
  })
}

function getReturns(price, prevPrice) {
  return (price - prevPrice) / prevPrice;
}

function forwardFill(historicalsMatrix) {
  let lastEntry = null;
  const [fst, ...rest] = historicalsMatrix;
  const filledRest = rest.map(assetHistoricals => {
    return fst.map(fstAssetHistorical => {
      const historicalForDate = findHistoricalByDate(
        assetHistoricals,
        fstAssetHistorical.date
      );
      if (!historicalForDate?.adjClose) return lastEntry;
      lastEntry = historicalForDate;
      return historicalForDate;
    });
  });
  return [fst, ...filledRest];
}

function findHistoricalByDate(historicals, date) {
  return historicals.find(assetPrice => {
    return compareDates(assetPrice.date, date);
  });
}

function compareDates(fst, snd) {
  // Truncate time
  const fstDate = new Date(fst).toDateString();
  const sndDate = new Date(snd).toDateString();
  return fstDate === sndDate;
}

function getCache(query, namespace) {
  const key = JSON.stringify({ namespace, ...query });
  return cache[key];
}

function setCache(query, value, namespace) {
  const key = JSON.stringify({ namespace, ...query });
  cache[key] = value;
}

function toSearchDTO(quote) {
  return {
    symbol: quote.symbol,
    shortname: quote.shortname
  };
}
