'use strict'

const {mapObject} = require('./formatter')
const {HttpEndpoint} = require('./http_endpoint')
const {Address} = require('./address')

/**
 * @private
 */
class ClientConfiguration {
    /**
     * @type {HttpEndpoint}
     */
    get swapEndpoint() {
        return this._swapEndpoint
    }

    /**
     * @type {HttpEndpoint}
     */
    get bscEndpoint() {
        return this._bscEndpoint
    }

    /**
     * @type {Address}
     */
    get contractHelper() {
        return this._contractHelper
    }

    /**
     *
     * @param {object} data
     * @param {HttpEndpoint} data.swapEndpoint
     * @param {HttpEndpoint} data.bscEndpoint
     * @param {Address} data.contractHelper
     */
    constructor(data) {
        this._swapEndpoint = data.swapEndpoint
        this._bscEndpoint = data.bscEndpoint
        this._contractHelper = data.contractHelper
    }

    /**
     *
     * @param {object} value
     * @param {string} value.swapEndpoint
     * @param {string} value.bscEndpoint
     * @param {string} value.contractHelper
     * @return {ClientConfiguration}
     * @throws {TypeError}
     */
    static fromObject(value) {
        let defaultValues = Object.assign({
            swapEndpoint: 'https://api.lz.finance/swap/',
            bscEndpoint: 'https://bsc-dataseed2.binance.org/',
            contractHelper: '0xe7c43509fd53f9834eedd0635db826cbfbc8ad32'
        }, value)
        let config = mapObject(defaultValues, [
            ['swapEndpoint', HttpEndpoint.fromString],
            ['bscEndpoint', HttpEndpoint.fromString],
            ['contractHelper', Address.fromHeximal]
        ])
        return new ClientConfiguration(config)
    }
}

module.exports = {
    ClientConfiguration
}
