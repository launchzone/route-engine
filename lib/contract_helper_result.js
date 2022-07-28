'use strict'

const {validateInstanceMap, validateArray} = require('./validator')
const {BigNumber} = require('./bignumber')
const {Address} = require('./address')

const POOL_NO_RESERVE = BigNumber.fromHeximal(
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
)

/**
 * @private
 */
class ContractHelperPool {

    /**
     *
     * @param {object} data
     * @param {Address} data.address
     * @param {BigNumber} data.reserve0
     * @param {BigNumber} data.reserve1
     */
    constructor(data) {
        this.address = data.address
        this.reserve0 = data.reserve0
        this.reserve1 = data.reserve1
    }

    /**
     *
     * @param {object} data
     * @param {Address} data.address
     * @param {BigNumber} data.reserve0
     * @param {BigNumber} data.reserve1
     * @return {ContractHelperPool}
     * @throws {TypeError}
     */
    static create(data) {
        let e1 = validateInstanceMap(data, [
            ['address', Address],
            ['reserve0', BigNumber],
            ['reserve1', BigNumber]
        ])
        if (e1) {
            throw new TypeError(e1)
        }
        return new ContractHelperPool(data)
    }
}

/**
 * @private
 */
class ContractHelperPoolMap extends Map {
    /**
     *
     * @param {Array<Array<BigNumber>>} reserves
     * @param {Array<Address>} addresses
     * @return {ContractHelperPoolMap}
     * @throws {TypeError}
     */
    static fromApiResponse(reserves, addresses) {
        if (reserves.length !== addresses.length) {
            throw new TypeError(
                'expect quantity of reserves is equal addresses'
            )
        }
        let e1 = validateArray(reserves, Array)
        if (e1) {
            throw new TypeError(e1)
        }
        let entries = []
        for (let i = 0; i < reserves.length; ++i) {
            let r = reserves[i]
            let e2 = validateArray(r, BigNumber, 2, 2)
            if (e2) {
                throw new TypeError(`reserves: [${i}]: ${e2}`)
            }
            let [reserve0, reserve1] = r
            if (reserve0.eq(POOL_NO_RESERVE)) {
                continue
            }
            let address = addresses[i]
            let pool = ContractHelperPool.create({
                address, reserve0, reserve1
            })
            entries.push([address.toHeximal(), pool])
        }
        return new ContractHelperPoolMap(entries)
    }
}

module.exports = {
    ContractHelperPool,
    ContractHelperPoolMap
}
