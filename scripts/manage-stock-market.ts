import { NS } from '@ns';

const HISTORY_SIZE = 2;
// const COMMISSION_FREE = 100_000;

interface Stock {
  symbol: string,
  organization: string,
  price: number,
  ask_price: number,
  bid_price: number,
  gain_unit_long: number,
  gain_unit_short: number,
  shares_owned_long: number,
  average_price_long: number,
  shares_owned_short: number,
  average_price_short: number

  forecast?: number,
  volatility?: number
}

interface HistoryItem {
  timestamp: Date,
  price: number
}

interface StockHistory {
  stock: Stock,
  history: Array<HistoryItem>
}

interface SellCandidate {
  symbol: string
}

interface BuyCandidate {
  symbol: string
}

function fetchStockList(ns: NS): Array<Stock> {
  const stocks = [];

  for (const symbol of ns.stock.getSymbols()) {
    const position = ns.stock.getPosition(symbol);
    const stock: Stock = {
      symbol: symbol,
      organization: ns.stock.getOrganization(symbol),
      price: ns.stock.getPrice(symbol),
      ask_price: ns.stock.getAskPrice(symbol),
      bid_price: ns.stock.getBidPrice(symbol),
      gain_unit_long: ns.stock.getSaleGain(symbol, 1, 'Long'),
      gain_unit_short: ns.stock.getSaleGain(symbol, 1, 'Short'),
      shares_owned_long: position[0],
      average_price_long: position[1],
      shares_owned_short: position[2],
      average_price_short: position[3]
    }

    if (ns.stock.hasTIXAPIAccess()) {
      stock['forecast'] = ns.stock.getForecast(symbol);
      stock['volatility'] = ns.stock.getVolatility(symbol);
    }

    stocks.push(stock);
  }

  return stocks;
}

function addToStocksWithHistories(stockHistories: Array<StockHistory>, stocks: Array<Stock>) {
  for (const stock of stocks) {
    const symbol = stock['symbol'];
    const price = stock['price'];

    const subset = stockHistories.filter((stockHistory) => stockHistory.stock.symbol == symbol);

    if (subset.length != 1) {
      throw new Error("Invalid subset length");
    }

    const stockHistoryItem = subset[0];
  }
}

export async function main(ns: NS) {
  ns.disableLog('ALL');
  const stocksWithHistories: Array<StockHistory> = new Array();

  for (let i = 0; i < HISTORY_SIZE; i++) {
    const stockList = fetchStockList(ns);
    addToStocksWithHistories(stocksWithHistories, stockList);

    await ns.stock.nextUpdate();
    ns.print(`[warm-up] TICK ${i + 1} of ${HISTORY_SIZE}`);
  }
}
