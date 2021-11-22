/**
 * Creating a mock of the datafeed
 * Tutorial: https://github.com/tradingview/charting-library-tutorial/blob/master/documentation/integration.md
 * Full implementation: https://github.com/tradingview/charting_library/wiki/JS-Api#how-to-start
 * Tutorial implementation: https://github.com/tradingview/charting-library-tutorial/blob/master/documentation/datafeed-implementation.md
 * Stream implementation: https://github.com/tradingview/charting-library-tutorial/blob/master/documentation/streaming-implementation.md
 */

import {getExchangeServerTime, getSymbols, getKlines, subscribeKline, unsubscribeKline, checkInterval} from './helpers'

const configurationData = {
    supports_marks: false,
    supports_timescale_marks: false,
    supports_time: true,
    supported_resolutions: [
        '1', '3', '5', '15', '30', '60', '120', '240', '1D', '3D', '1W', '1M'
    ]
};
let drawed = false
let intervalChange = ''
let newBar = []
let play = false

export default {
    // get a configuration of your datafeed (e.g. supported resolutions, exchanges and so on)
    onReady: (callback) => {
        console.log('[onReady]: Method call');
        setTimeout(() => callback(configurationData)) // callback must be called asynchronously.
    },

    // NO need if not using search
    searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
        let symbols = [{
            symbol: "EURUSD",
            full_name: "EURUSD", // e.g. BTCE:BTCUSD
            description: "EUR to USD with using 1m candles",
            exchange: "EURUSD",
            ticker: "EURUSD",
            type: "stock"
        }]
        // getSymbols().then(res => {
        // 	symbols = res.filter(symbol => symbol.symbol === 'EURUSD'|'BTCUSDT')
        // 	console.log(symbols)
        // })
        onResultReadyCallback(symbols)
    },


    // retrieve information about a specific symbol (exchange, price scale, full symbol etc.)
    resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
        console.log('[resolveSymbol]: Method call', symbolName);

        const comps = symbolName.split(':')
        symbolName = (comps.length > 1 ? comps[1] : symbolName).toUpperCase()


        // need for pricescale()
        function pricescale(symbol) {
            for (let filter of symbol.filters) {
                if (filter.filterType == 'PRICE_FILTER') {
                    return Math.round(1 / parseFloat(filter.tickSize))
                }
            }
            return 1
        }

        const symbolInfo = (symbol) => ({
            name: symbol.symbol,
            description: symbol.baseAsset + ' / ' + symbol.quoteAsset,
            ticker: symbol.symbol,
            //exchange: 'Binance',
            //listed_exchange: 'Binance',
            //type: 'crypto',
            session: '24x7',
            minmov: 1,
            pricescale: 100000, //pricescale(symbol), // 	or 100
            timezone: 'UTC',
            has_intraday: true,
            has_daily: true,
            has_weekly_and_monthly: true,
            currency_code: symbol.quoteAsset,
        })

        // Get symbols
        getSymbols().then(symbols => {
            const symbol = symbols.find(i => i.symbol == symbolName)
            return symbol ? onSymbolResolvedCallback(symbolInfo(symbol)) : onResolveErrorCallback('[resolveSymbol]: symbol not found')
        })

    },


    // get historical data for the symbol
    // https://github.com/tradingview/charting_library/wiki/JS-Api#getbarssymbolinfo-resolution-periodparams-onhistorycallback-onerrorcallback
    getBars: async (symbolInfo, interval, periodParams, onHistoryCallback, onErrorCallback) => {
        console.log('[getBars] Method call', symbolInfo, interval)

        if (!checkInterval(interval)) {
            return onErrorCallback('[getBars] Invalid interval')
        }

        const dateFrom = new Date(0)

        let klines = await getKlines({
            symbol: symbolInfo.name, interval, from: new Date(0), to: Date.now(), limit: 1000
        })

        newBar = klines.slice(800, klines.length)
        const historicLines = klines.slice(0, 799)

        console.log(historicLines)

        if (intervalChange === interval) {
            drawed = true
            intervalChange = interval
        } else {
            drawed = false
            intervalChange = interval
        }
        if (klines.length > 0 && !drawed) {
            onHistoryCallback(historicLines)
        }

        onErrorCallback('Klines data error')

    },
    // subscription to real-time updates
    subscribeBars: (symbolInfo, interval, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
        console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID);

        if (play) {
            for (let i = 0; i < newBar.length; i++) {
                setTimeout(function timer() {
                    onRealtimeCallback(newBar[i])
                }, i * 1000)
            }
        }

        subscribeKline({symbol: symbolInfo.name, interval, uniqueID: subscribeUID,}, cb => {
        })
    },
    unsubscribeBars: (subscriberUID) => {
        console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
        unsubscribeKline(subscriberUID)
    },
    getServerTime: (callback) => {
        getExchangeServerTime().then(time => {
            callback(Math.floor(time / 1000))
        }).catch(err => {
            console.error(err)
        })
    }
};
