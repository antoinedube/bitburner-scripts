const HISTORY_SIZE = 50;
const COMMISSION_FREE = 100000;

function fetchStocksWithDetails(ns) {
	const stocks = [];

	for (const symbol of ns.stock.getSymbols()) {
		const position = ns.stock.getPosition(symbol);
		const stock = {
			'symbol': symbol,
			'organization': ns.stock.getOrganization(symbol),
			'price': ns.stock.getPrice(symbol),
			'ask-price': ns.stock.getAskPrice(symbol),
			'bid-price': ns.stock.getBidPrice(symbol),
			'gain-unit-long': ns.stock.getSaleGain(symbol, 1, 'Long'),
			'gain-unit-short': ns.stock.getSaleGain(symbol, 1, 'Short'),
			'shares-owned-long': position[0],
			'average-price-long': position[1],
			'shares-owned-short': position[2],
			'average-price-short': position[3]
		}

		if (ns.stock.hasTIXApiAccess) {
			stock['forecast'] = ns.stock.getForecast(symbol);
			stock['volatilify'] = ns.tock.getVolatility(symbol);
		}

		stocks.push(stock);
	}

	return stocks;
}

function addToStocksWithHistories(ns, stocksWithHistories, stocks) {
	for (const stock of stocks) {
		const symbol = stock['symbol'];
		const price = stock['price'];

		if (!stocksWithHistories[symbol]) {
			stocksWithHistories[symbol] = [];
		}

		stocksWithHistories[symbol].push(price);

		if (stocksWithHistories[symbol].length > HISTORY_SIZE) {
			stocksWithHistories[symbol].shift();
		}
	}
}

function buildBuyList(ns, stocks, stocksWithHistories) {
	const buyList = [];
	for (const stock of stocks) {
		const currentPrice = stock['price'];
		const priceHistory = stocksWithHistories[stock['symbol']].slice(0, -1);
		const minPriceFromHistory = Math.min(...priceHistory);

		if (minPriceFromHistory < currentPrice) {
			continue;
		}

		const maxShares = ns.stock.getMaxShares(stock['symbol']);
		const numSharesWithAvailableMoney = Math.floor((ns.getServerMoneyAvailable('home') - COMMISSION_FREE) / stock['ask-price']);
		const numSharesToBuy = Math.min(10000, maxShares, numSharesWithAvailableMoney);
		const purchaseCost = ns.stock.getPurchaseCost(stock['symbol'], numSharesToBuy, 'long');

		buyList.push({
			'symbol': stock['symbol'],
			'num-shares': numSharesToBuy,
			'purchase-cost': purchaseCost,
			'position': 'long'
		});
	}

	buyList.sort((a, b) => b['purchase-cost'] - a['purchase-cost']);

	return buyList;
}

function buyShares(ns, buyList) {
	for (const stock of buyList) {
		if (stock['purchase-cost'] < ns.getServerMoneyAvailable('home')) {
			const pricePaidPerShare = ns.stock.buyStock(stock['symbol'], stock['num-shares']);
			ns.print(`${new Date()} --> Buying shares of ${stock['symbol']} --> Price paid: ${ns.formatNumber(stock['purchase-cost'])}\$ at ${ns.formatNumber(pricePaidPerShare)}\$ each`);
		}
	}
}

function buildSellList(ns, stocks) {
	const sellList = [];
	for (const stock of stocks) {
		const numSharesToSell = Math.floor(0.25 * stock['shares-owned-long']);
		const saleGain = ns.stock.getSaleGain(stock['symbol'], numSharesToSell, 'long');
		const stockValue = numSharesToSell * stock['average-price-long'];

		if (saleGain < 0.0 || saleGain <= stockValue) {
			continue;
		}

		sellList.push({
			'symbol': stock['symbol'],
			'num-shares': numSharesToSell,
			'sale-gain': saleGain,
			'position': 'long'
		});
	}

	return sellList;
}

function sellShares(ns, sellList) {
	for (const stock of sellList) {
		const moneyEarnedPerShare = ns.stock.sellStock(stock['symbol'], stock['num-shares']);
		ns.print(`${new Date()} --> Selling shares of ${stock['symbol']} --> Money earned: ${ns.formatNumber(stock['sale-gain'])}\$ at ${ns.formatNumber(moneyEarnedPerShare)}\$ each`);
	}
}

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('ALL');
	const stocksWithHistories = {};

	for (let i = 0; i < HISTORY_SIZE; i++) {
		const stockList = fetchStocksWithDetails(ns);
		addToStocksWithHistories(ns, stocksWithHistories, stockList);

		await ns.stock.nextUpdate();
		ns.print(`[warm-up] TICK ${i + 1} of ${HISTORY_SIZE}`);
	}

	while (true) {
		const stocks = fetchStocksWithDetails(ns);
		addToStocksWithHistories(ns, stocksWithHistories, stocks);

		const buyList = buildBuyList(ns, stocks, stocksWithHistories);
		buyShares(ns, buyList);

		const sellList = buildSellList(ns, stocks);
		sellShares(ns, sellList);

		await ns.stock.nextUpdate();
	}
}