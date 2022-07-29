'use strict'

/**
 * Default endpoint of Binance Smart Chain node.
 *
 * @constant {string}
 */
const BSC_ENDPOINT_DEFAULT = 'https://bsc-dataseed2.binance.org/'
/**
 * Default endpoint of `swap_api` service.
 *
 * @constant {string}
 */
const SWAP_ENDPOINT_DEFAULT = 'https://api.lz.finance/swap/'
/**
 * Default address of contract for fetching pool's reserves.
 *
 * @constant {string}
 */
const CONTRACT_HELPER_DEFAULT = '0xe7c43509fd53f9834eedd0635db826cbfbc8ad32'

module.exports = {
    BSC_ENDPOINT_DEFAULT,
    SWAP_ENDPOINT_DEFAULT,
    CONTRACT_HELPER_DEFAULT
}
