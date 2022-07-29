'use strict'

const {ExchangeName} = require('bsc_util')

/**
 * Exchange names on Binance Smart Chain network.
 *
 * @readonly
 * @enum {string}
 */
const Exchange = {
    PANCAKE: ExchangeName.PANCAKE,
    PANCAKE2: ExchangeName.PANCAKE2,
    JUL: ExchangeName.JUL,
    APE: ExchangeName.APE,
    BI: ExchangeName.BI,
    MDEX: ExchangeName.MDEX,
    CAFE: ExchangeName.CAFE,
    JET: ExchangeName.JET,
    BABY: ExchangeName.BABY
}

module.exports = {
    Exchange
}
