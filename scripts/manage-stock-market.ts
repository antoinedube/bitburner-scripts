import { NS } from '@ns';

const HISTORY_SIZE = 2;
const COMMISSION_FREE = 100000;

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

function fetchStockList(ns: NS) : Array<Stock> {
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

        const subset = stockHistories.filter((stockHistory) => stockHistory.stock.symbol==symbol);

        if (subset.length!=1) {
            throw new Error("Invalid subset length");
        }

        const stockHistoryItem = subset[0];

        // if (!stocksWithHistories[symbol]) {
        //     stocksWithHistories[symbol] = [];
        // }

        // stocksWithHistories[symbol].push(price);

        // if (stocksWithHistories[symbol].length > HISTORY_SIZE) {
        //     stocksWithHistories[symbol].shift();
        // }
    }
}

// function buildBuyList(ns: NS, stocks: Array<Stock>, stocksWithHistories: Array<StockHistory>) {
//     const buyList = [];
//     for (const stock of stocks) {
//         const currentPrice = stock['price'];
//         const priceHistory = stocksWithHistories[stock['symbol']].slice(0, -1);
//         const minPriceFromHistory = Math.min(...priceHistory);
//
//         if (minPriceFromHistory < currentPrice) {
//             continue;
//         }
//
//         const maxShares = ns.stock.getMaxShares(stock['symbol']);
//         const numSharesWithAvailableMoney = Math.floor((ns.getServerMoneyAvailable('home') - COMMISSION_FREE) / stock['ask-price']);
//         const numSharesToBuy = Math.min(10000, maxShares, numSharesWithAvailableMoney);
//         const purchaseCost = ns.stock.getPurchaseCost(stock['symbol'], numSharesToBuy, 'long');
//
//         buyList.push({
//             'symbol': stock['symbol'],
//             'num-shares': numSharesToBuy,
//             'purchase-cost': purchaseCost,
//             'position': 'long'
//         });
//     }
//
//     buyList.sort((a, b) => b['purchase-cost'] - a['purchase-cost']);
//
//     return buyList;
// }

// function buyShares(ns: NS, buyList: Stock[]) {
//     for (const stock of buyList) {
//         if (stock.purchase_cost < ns.getServerMoneyAvailable('home')) {
//             const pricePaidPerShare = ns.stock.buyStock(stock['symbol'], stock['num-shares']);
//             ns.print(`${new Date()} --> Buying shares of ${stock['symbol']} --> Price paid: ${ns.formatNumber(stock['purchase-cost'])}\$ at ${ns.formatNumber(pricePaidPerShare)}\$ each`);
//         }
//     }
// }

// function buildSellList(ns, stocks) {
//     const sellList = [];
//     for (const stock of stocks) {
//         const numSharesToSell = Math.floor(0.25 * stock['shares-owned-long']);
//         const saleGain = ns.stock.getSaleGain(stock['symbol'], numSharesToSell, 'long');
//         const stockValue = numSharesToSell * stock['average-price-long'];
//
//         if (saleGain < 0.0 || saleGain <= stockValue) {
//             continue;
//         }
//
//         sellList.push({
//             'symbol': stock['symbol'],
//             'num-shares': numSharesToSell,
//             'sale-gain': saleGain,
//             'position': 'long'
//         });
//     }
//
//     return sellList;
// }

// function sellShares(ns, sellList) {
//     for (const stock of sellList) {
//         const moneyEarnedPerShare = ns.stock.sellStock(stock['symbol'], stock['num-shares']);
//         ns.print(`${new Date()} --> Selling shares of ${stock['symbol']} --> Money earned: ${ns.formatNumber(stock['sale-gain'])}\$ at ${ns.formatNumber(moneyEarnedPerShare)}\$ each`);
//     }
// }

export async function main(ns: NS) {
    ns.disableLog('ALL');
    const stocksWithHistories: Array<StockHistory> = new Array();

    for (let i = 0; i < HISTORY_SIZE; i++) {
        const stockList = fetchStockList(ns);
        addToStocksWithHistories(stocksWithHistories, stockList);

        await ns.stock.nextUpdate();
        ns.print(`[warm-up] TICK ${i + 1} of ${HISTORY_SIZE}`);
    }

    // while (true) {
    //     const stocks = fetchStockList(ns);
    //     addToStocksWithHistories(stocksWithHistories, stocks);

    //     const buyList = buildBuyList(ns, stocks, stocksWithHistories);
    //     buyShares(ns, buyList);

    //     const sellList = buildSellList(ns, stocks);
    //     sellShares(ns, sellList);

    //     await ns.stock.nextUpdate();
    // }
}
