const HISTORY_SIZE = 2;
const COMMISSION_FREE = 100000;
function fetchStockList(ns) {
    const stocks = [];
    for (const symbol of ns.stock.getSymbols()) {
        const position = ns.stock.getPosition(symbol);
        const stock = {
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
        };
        if (ns.stock.hasTIXAPIAccess()) {
            stock['forecast'] = ns.stock.getForecast(symbol);
            stock['volatility'] = ns.stock.getVolatility(symbol);
        }
        stocks.push(stock);
    }
    return stocks;
}
function addToStocksWithHistories(stockHistories, stocks) {
    for (const stock of stocks) {
        const symbol = stock['symbol'];
        const price = stock['price'];
        const subset = stockHistories.filter((stockHistory) => stockHistory.stock.symbol == symbol);
        if (subset.length != 1) {
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
export async function main(ns) {
    ns.disableLog('ALL');
    const stocksWithHistories = new Array();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlLXN0b2NrLW1hcmtldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NjcmlwdHMvbWFuYWdlLXN0b2NrLW1hcmtldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLFlBQVksR0FBRyxDQUFDLENBQUM7QUFDdkIsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBcUMvQixTQUFTLGNBQWMsQ0FBQyxFQUFNO0lBQzFCLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUVsQixLQUFLLE1BQU0sTUFBTSxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEVBQUU7UUFDeEMsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsTUFBTSxLQUFLLEdBQVU7WUFDakIsTUFBTSxFQUFFLE1BQU07WUFDZCxZQUFZLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDO1lBQzlDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDaEMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztZQUN2QyxTQUFTLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO1lBQ3ZDLGNBQWMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQztZQUN2RCxlQUFlLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUM7WUFDekQsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM5QixrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQy9CLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxD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LEVBQUU7UUFDbkMsTUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLHdCQUF3QixDQUFDLG1CQUFtQixFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXpELE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM1QixFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxPQUFPLFlBQVksRUFBRSxDQUFDLENBQUM7S0FDMUQ7SUFFRCxpQkFBaUI7SUFDakIseUNBQXlDO0lBQ3pDLDZEQUE2RDtJQUU3RCxxRUFBcUU7SUFDckUsOEJBQThCO0lBRTlCLGtEQUFrRDtJQUNsRCxnQ0FBZ0M7SUFFaEMsbUNBQW1DO0lBQ25DLElBQUk7QUFDUixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTlMgfSBmcm9tICdAbnMnO1xuXG5jb25zdCBISVNUT1JZX1NJWkUgPSAyO1xuY29uc3QgQ09NTUlTU0lPTl9GUkVFID0gMTAwMDAwO1xuXG5pbnRlcmZhY2UgU3RvY2sge1xuICAgIHN5bWJvbDogc3RyaW5nLFxuICAgIG9yZ2FuaXphdGlvbjogc3RyaW5nLFxuICAgIHByaWNlOiBudW1iZXIsXG4gICAgYXNrX3ByaWNlOiBudW1iZXIsXG4gICAgYmlkX3ByaWNlOiBudW1iZXIsXG4gICAgZ2Fpbl91bml0X2xvbmc6IG51bWJlcixcbiAgICBnYWluX3VuaXRfc2hvcnQ6IG51bWJlcixcbiAgICBzaGFyZXNfb3duZWRfbG9uZzogbnVtYmVyLFxuICAgIGF2ZXJhZ2VfcHJpY2VfbG9uZzogbnVtYmVyLFxuICAgIHNoYXJlc19vd25lZF9zaG9ydDogbnVtYmVyLFxuICAgIGF2ZXJhZ2VfcHJpY2Vfc2hvcnQ6IG51bWJlclxuXG4gICAgZm9yZWNhc3Q/OiBudW1iZXIsXG4gICAgdm9sYXRpbGl0eT86IG51bWJlclxufVxuXG5pbnRlcmZhY2UgSGlzdG9yeUl0ZW0ge1xuICAgIHRpbWVzdGFtcDogRGF0ZSxcbiAgICBwcmljZTogbnVtYmVyXG59XG5cbmludGVyZmFjZSBTdG9ja0hpc3Rvcnkge1xuICAgIHN0b2NrOiBTdG9jayxcbiAgICBoaXN0b3J5OiBBcnJheTxIaXN0b3J5SXRlbT5cbn1cblxuaW50ZXJmYWNlIFNlbGxDYW5kaWRhdGUge1xuICAgIHN5bWJvbDogc3RyaW5nXG59XG5cbmludGVyZmFjZSBCdXlDYW5kaWRhdGUge1xuICAgIHN5bWJvbDogc3RyaW5nXG59XG5cbmZ1bmN0aW9uIGZldGNoU3RvY2tMaXN0KG5zOiBOUykgOiBBcnJheTxTdG9jaz4ge1xuICAgIGNvbnN0IHN0b2NrcyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBzeW1ib2wgb2YgbnMuc3RvY2suZ2V0U3ltYm9scygpKSB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbnMuc3RvY2suZ2V0UG9zaXRpb24oc3ltYm9sKTtcbiAgICAgICAgY29uc3Qgc3RvY2s6IFN0b2NrID0ge1xuICAgICAgICAgICAgc3ltYm9sOiBzeW1ib2wsXG4gICAgICAgICAgICBvcmdhbml6YXRpb246IG5zLnN0b2NrLmdldE9yZ2FuaXphdGlvbihzeW1ib2wpLFxuICAgICAgICAgICAgcHJpY2U6IG5zLnN0b2NrLmdldFByaWNlKHN5bWJvbCksXG4gICAgICAgICAgICBhc2tfcHJpY2U6IG5zLnN0b2NrLmdldEFza1ByaWNlKHN5bWJvbCksXG4gICAgICAgICAgICBiaWRfcHJpY2U6IG5zLnN0b2NrLmdldEJpZFByaWNlKHN5bWJvbCksXG4gICAgICAgICAgICBnYWluX3VuaXRfbG9uZzogbnMuc3RvY2suZ2V0U2FsZUdhaW4oc3ltYm9sLCAxLCAnTG9uZycpLFxuICAgICAgICAgICAgZ2Fpbl91bml0X3Nob3J0OiBucy5zdG9jay5nZXRTYWxlR2FpbihzeW1ib2wsIDEsICdTaG9ydCcpLFxuICAgICAgICAgICAgc2hhcmVzX293bmVkX2xvbmc6IHBvc2l0aW9uWzBdLFxuICAgICAgICAgICAgYXZlcmFnZV9wcmljZV9sb25nOiBwb3NpdGlvblsxXSxcbiAgICAgICAgICAgIHNoYXJlc19vd25lZF9zaG9ydDogcG9zaXRpb25bMl0sXG4gICAgICAgICAgICBhdmVyYWdlX3ByaWNlX3Nob3J0OiBwb3NpdGlvblszXVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5zLnN0b2NrLmhhc1RJWEFQSUFjY2VzcygpKSB7XG4gICAgICAgICAgICBzdG9ja1snZm9yZWNhc3QnXSA9IG5zLnN0b2NrLmdldEZvcmVjYXN0KHN5bWJvbCk7XG4gICAgICAgICAgICBzdG9ja1sndm9sYXRpbGl0eSddID0gbnMuc3RvY2suZ2V0Vm9sYXRpbGl0eShzeW1ib2wpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvY2tzLnB1c2goc3RvY2spO1xuICAgIH1cblxuICAgIHJldHVybiBzdG9ja3M7XG59XG5cbmZ1bmN0aW9uIGFkZFRvU3RvY2tzV2l0aEhpc3RvcmllcyhzdG9ja0hpc3RvcmllczogQXJyYXk8U3RvY2tIaXN0b3J5Piwgc3RvY2tzOiBBcnJheTxTdG9jaz4pIHtcbiAgICBmb3IgKGNvbnN0IHN0b2NrIG9mIHN0b2Nrcykge1xuICAgICAgICBjb25zdCBzeW1ib2wgPSBzdG9ja1snc3ltYm9sJ107XG4gICAgICAgIGNvbnN0IHByaWNlID0gc3RvY2tbJ3ByaWNlJ107XG5cbiAgICAgICAgY29uc3Qgc3Vic2V0ID0gc3RvY2tIaXN0b3JpZXMuZmlsdGVyKChzdG9ja0hpc3RvcnkpID0+IHN0b2NrSGlzdG9yeS5zdG9jay5zeW1ib2w9PXN5bWJvbCk7XG5cbiAgICAgICAgaWYgKHN1YnNldC5sZW5ndGghPTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc3Vic2V0IGxlbmd0aFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0b2NrSGlzdG9yeUl0ZW0gPSBzdWJzZXRbMF07XG5cbiAgICAgICAgLy8gaWYgKCFzdG9ja3NXaXRoSGlzdG9yaWVzW3N5bWJvbF0pIHtcbiAgICAgICAgLy8gICAgIHN0b2Nrc1dpdGhIaXN0b3JpZXNbc3ltYm9sXSA9IFtdO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gc3RvY2tzV2l0aEhpc3Rvcmllc1tzeW1ib2xdLnB1c2gocHJpY2UpO1xuXG4gICAgICAgIC8vIGlmIChzdG9ja3NXaXRoSGlzdG9yaWVzW3N5bWJvbF0ubGVuZ3RoID4gSElTVE9SWV9TSVpFKSB7XG4gICAgICAgIC8vICAgICBzdG9ja3NXaXRoSGlzdG9yaWVzW3N5bWJvbF0uc2hpZnQoKTtcbiAgICAgICAgLy8gfVxuICAgIH1cbn1cblxuLy8gZnVuY3Rpb24gYnVpbGRCdXlMaXN0KG5zOiBOUywgc3RvY2tzOiBBcnJheTxTdG9jaz4sIHN0b2Nrc1dpdGhIaXN0b3JpZXM6IEFycmF5PFN0b2NrSGlzdG9yeT4pIHtcbi8vICAgICBjb25zdCBidXlMaXN0ID0gW107XG4vLyAgICAgZm9yIChjb25zdCBzdG9jayBvZiBzdG9ja3MpIHtcbi8vICAgICAgICAgY29uc3QgY3VycmVudFByaWNlID0gc3RvY2tbJ3ByaWNlJ107XG4vLyAgICAgICAgIGNvbnN0IHByaWNlSGlzdG9yeSA9IHN0b2Nrc1dpdGhIaXN0b3JpZXNbc3RvY2tbJ3N5bWJvbCddXS5zbGljZSgwLCAtMSk7XG4vLyAgICAgICAgIGNvbnN0IG1pblByaWNlRnJvbUhpc3RvcnkgPSBNYXRoLm1pbiguLi5wcmljZUhpc3RvcnkpO1xuLy9cbi8vICAgICAgICAgaWYgKG1pblByaWNlRnJvbUhpc3RvcnkgPCBjdXJyZW50UHJpY2UpIHtcbi8vICAgICAgICAgICAgIGNvbnRpbnVlO1xuLy8gICAgICAgICB9XG4vL1xuLy8gICAgICAgICBjb25zdCBtYXhTaGFyZXMgPSBucy5zdG9jay5nZXRNYXhTaGFyZXMoc3RvY2tbJ3N5bWJvbCddKTtcbi8vICAgICAgICAgY29uc3QgbnVtU2hhcmVzV2l0aEF2YWlsYWJsZU1vbmV5ID0gTWF0aC5mbG9vcigobnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUoJ2hvbWUnKSAtIENPTU1JU1NJT05fRlJFRSkgLyBzdG9ja1snYXNrLXByaWNlJ10pO1xuLy8gICAgICAgICBjb25zdCBudW1TaGFyZXNUb0J1eSA9IE1hdGgubWluKDEwMDAwLCBtYXhTaGFyZXMsIG51bVNoYXJlc1dpdGhBdmFpbGFibGVNb25leSk7XG4vLyAgICAgICAgIGNvbnN0IHB1cmNoYXNlQ29zdCA9IG5zLnN0b2NrLmdldFB1cmNoYXNlQ29zdChzdG9ja1snc3ltYm9sJ10sIG51bVNoYXJlc1RvQnV5LCAnbG9uZycpO1xuLy9cbi8vICAgICAgICAgYnV5TGlzdC5wdXNoKHtcbi8vICAgICAgICAgICAgICdzeW1ib2wnOiBzdG9ja1snc3ltYm9sJ10sXG4vLyAgICAgICAgICAgICAnbnVtLXNoYXJlcyc6IG51bVNoYXJlc1RvQnV5LFxuLy8gICAgICAgICAgICAgJ3B1cmNoYXNlLWNvc3QnOiBwdXJjaGFzZUNvc3QsXG4vLyAgICAgICAgICAgICAncG9zaXRpb24nOiAnbG9uZydcbi8vICAgICAgICAgfSk7XG4vLyAgICAgfVxuLy9cbi8vICAgICBidXlMaXN0LnNvcnQoKGEsIGIpID0+IGJbJ3B1cmNoYXNlLWNvc3QnXSAtIGFbJ3B1cmNoYXNlLWNvc3QnXSk7XG4vL1xuLy8gICAgIHJldHVybiBidXlMaXN0O1xuLy8gfVxuXG4vLyBmdW5jdGlvbiBidXlTaGFyZXMobnM6IE5TLCBidXlMaXN0OiBTdG9ja1tdKSB7XG4vLyAgICAgZm9yIChjb25zdCBzdG9jayBvZiBidXlMaXN0KSB7XG4vLyAgICAgICAgIGlmIChzdG9jay5wdXJjaGFzZV9jb3N0IDwgbnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUoJ2hvbWUnKSkge1xuLy8gICAgICAgICAgICAgY29uc3QgcHJpY2VQYWlkUGVyU2hhcmUgPSBucy5zdG9jay5idXlTdG9jayhzdG9ja1snc3ltYm9sJ10sIHN0b2NrWydudW0tc2hhcmVzJ10pO1xuLy8gICAgICAgICAgICAgbnMucHJpbnQoYCR7bmV3IERhdGUoKX0gLS0+IEJ1eWluZyBzaGFyZXMgb2YgJHtzdG9ja1snc3ltYm9sJ119IC0tPiBQcmljZSBwYWlkOiAke25zLmZvcm1hdE51bWJlcihzdG9ja1sncHVyY2hhc2UtY29zdCddKX1cXCQgYXQgJHtucy5mb3JtYXROdW1iZXIocHJpY2VQYWlkUGVyU2hhcmUpfVxcJCBlYWNoYCk7XG4vLyAgICAgICAgIH1cbi8vICAgICB9XG4vLyB9XG5cbi8vIGZ1bmN0aW9uIGJ1aWxkU2VsbExpc3QobnMsIHN0b2Nrcykge1xuLy8gICAgIGNvbnN0IHNlbGxMaXN0ID0gW107XG4vLyAgICAgZm9yIChjb25zdCBzdG9jayBvZiBzdG9ja3MpIHtcbi8vICAgICAgICAgY29uc3QgbnVtU2hhcmVzVG9TZWxsID0gTWF0aC5mbG9vcigwLjI1ICogc3RvY2tbJ3NoYXJlcy1vd25lZC1sb25nJ10pO1xuLy8gICAgICAgICBjb25zdCBzYWxlR2FpbiA9IG5zLnN0b2NrLmdldFNhbGVHYWluKHN0b2NrWydzeW1ib2wnXSwgbnVtU2hhcmVzVG9TZWxsLCAnbG9uZycpO1xuLy8gICAgICAgICBjb25zdCBzdG9ja1ZhbHVlID0gbnVtU2hhcmVzVG9TZWxsICogc3RvY2tbJ2F2ZXJhZ2UtcHJpY2UtbG9uZyddO1xuLy9cbi8vICAgICAgICAgaWYgKHNhbGVHYWluIDwgMC4wIHx8IHNhbGVHYWluIDw9IHN0b2NrVmFsdWUpIHtcbi8vICAgICAgICAgICAgIGNvbnRpbnVlO1xuLy8gICAgICAgICB9XG4vL1xuLy8gICAgICAgICBzZWxsTGlzdC5wdXNoKHtcbi8vICAgICAgICAgICAgICdzeW1ib2wnOiBzdG9ja1snc3ltYm9sJ10sXG4vLyAgICAgICAgICAgICAnbnVtLXNoYXJlcyc6IG51bVNoYXJlc1RvU2VsbCxcbi8vICAgICAgICAgICAgICdzYWxlLWdhaW4nOiBzYWxlR2Fpbixcbi8vICAgICAgICAgICAgICdwb3NpdGlvbic6ICdsb25nJ1xuLy8gICAgICAgICB9KTtcbi8vICAgICB9XG4vL1xuLy8gICAgIHJldHVybiBzZWxsTGlzdDtcbi8vIH1cblxuLy8gZnVuY3Rpb24gc2VsbFNoYXJlcyhucywgc2VsbExpc3QpIHtcbi8vICAgICBmb3IgKGNvbnN0IHN0b2NrIG9mIHNlbGxMaXN0KSB7XG4vLyAgICAgICAgIGNvbnN0IG1vbmV5RWFybmVkUGVyU2hhcmUgPSBucy5zdG9jay5zZWxsU3RvY2soc3RvY2tbJ3N5bWJvbCddLCBzdG9ja1snbnVtLXNoYXJlcyddKTtcbi8vICAgICAgICAgbnMucHJpbnQoYCR7bmV3IERhdGUoKX0gLS0+IFNlbGxpbmcgc2hhcmVzIG9mICR7c3RvY2tbJ3N5bWJvbCddfSAtLT4gTW9uZXkgZWFybmVkOiAke25zLmZvcm1hdE51bWJlcihzdG9ja1snc2FsZS1nYWluJ10pfVxcJCBhdCAke25zLmZvcm1hdE51bWJlcihtb25leUVhcm5lZFBlclNoYXJlKX1cXCQgZWFjaGApO1xuLy8gICAgIH1cbi8vIH1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4obnM6IE5TKSB7XG4gICAgbnMuZGlzYWJsZUxvZygnQUxMJyk7XG4gICAgY29uc3Qgc3RvY2tzV2l0aEhpc3RvcmllczogQXJyYXk8U3RvY2tIaXN0b3J5PiA9IG5ldyBBcnJheSgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBISVNUT1JZX1NJWkU7IGkrKykge1xuICAgICAgICBjb25zdCBzdG9ja0xpc3QgPSBmZXRjaFN0b2NrTGlzdChucyk7XG4gICAgICAgIGFkZFRvU3RvY2tzV2l0aEhpc3RvcmllcyhzdG9ja3NXaXRoSGlzdG9yaWVzLCBzdG9ja0xpc3QpO1xuXG4gICAgICAgIGF3YWl0IG5zLnN0b2NrLm5leHRVcGRhdGUoKTtcbiAgICAgICAgbnMucHJpbnQoYFt3YXJtLXVwXSBUSUNLICR7aSArIDF9IG9mICR7SElTVE9SWV9TSVpFfWApO1xuICAgIH1cblxuICAgIC8vIHdoaWxlICh0cnVlKSB7XG4gICAgLy8gICAgIGNvbnN0IHN0b2NrcyA9IGZldGNoU3RvY2tMaXN0KG5zKTtcbiAgICAvLyAgICAgYWRkVG9TdG9ja3NXaXRoSGlzdG9yaWVzKHN0b2Nrc1dpdGhIaXN0b3JpZXMsIHN0b2Nrcyk7XG5cbiAgICAvLyAgICAgY29uc3QgYnV5TGlzdCA9IGJ1aWxkQnV5TGlzdChucywgc3RvY2tzLCBzdG9ja3NXaXRoSGlzdG9yaWVzKTtcbiAgICAvLyAgICAgYnV5U2hhcmVzKG5zLCBidXlMaXN0KTtcblxuICAgIC8vICAgICBjb25zdCBzZWxsTGlzdCA9IGJ1aWxkU2VsbExpc3QobnMsIHN0b2Nrcyk7XG4gICAgLy8gICAgIHNlbGxTaGFyZXMobnMsIHNlbGxMaXN0KTtcblxuICAgIC8vICAgICBhd2FpdCBucy5zdG9jay5uZXh0VXBkYXRlKCk7XG4gICAgLy8gfVxufVxuIl19