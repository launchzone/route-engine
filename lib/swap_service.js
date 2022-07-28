'use strict'

const axios = require('axios')
const {HttpEndpointError} = require('./error')
const {
    validateInstanceMap, validateArray, validateInstance
} = require('./validator')
const {HttpEndpoint} = require('./http_endpoint')
const {Address} = require('./address')
const {
    GetPoolsByTopTokenReserveResult
} = require('./get_pools_by_top_token_reserve_result')

/**
 * For calling APIs from service `swap_api`.
 *
 * @private
 */
class SwapService {
    /**
     * @param {object} services
     * @param {axios.Axios} services.httpClient
     */
    constructor(services) {
        this._httpClient = services.httpClient
    }

    /**
     * @param {object} options
     * @param {HttpEndpoint} options.endpoint
     * @return {SwapService}
     * @throws {TypeError}
     */
    static create(options) {
        let e1 = validateInstanceMap(options, [
            ['endpoint', HttpEndpoint]
        ])
        if (e1) {
            throw new TypeError(e1)
        }
        let httpClient = axios.create({
            baseURL: options.endpoint.value.toString(),
            validateStatus: () => true,
            transformResponse: (response) => response
        })
        return new SwapService({httpClient})
    }

    /**
     * Call API `GET /pool/top-token-reserve`.
     *
     * @param {Array<Address>} addresses
     * @param {number} limit
     * @return {Promise<GetPoolsByTopTokenReserveResult>}
     * @throws {TypeError | HttpEndpointError}
     */
    async getPoolsByTopTokenReserve(addresses, limit = 8) {
        let e1 = validateArray(addresses, Address, 1, 16)
        if (e1) {
            throw new TypeError(`addresses: ${e1}`)
        }
        let e2 = validateInstance(limit, 'number')
        if (e2) {
            throw new TypeError(`limit: ${e2}`)
        }
        let res = await this._httpClient.get('/pool/top-token-reserve', {
            params: {
                a: addresses.map(a => a.toHeximal()).join(','),
                l: limit
            }
        })
        if (_isSuccessfulStatus(res.status) === false) {
            throw HttpEndpointError.fromAxiosResponse(res)
        }
        try {
            return GetPoolsByTopTokenReserveResult.fromJsonString(res.data)
        }
        catch (error) {
            throw new HttpEndpointError(res.status, error.message)
        }
    }
}

/**
 *
 * @param {number} status
 * @return {boolean}
 */
function _isSuccessfulStatus(status) {
    return (status >= 200) && (status < 300)
}

module.exports = {
    SwapService,
    GetPoolsByTopTokenReserveResult
}
